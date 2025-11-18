import mongoose from "mongoose";
import { describe, test, expect, beforeEach, vi } from "vitest";

let reviewService;
let ReviewModel, BookModel;
let mockSort, mockLimit;

describe("Review Service", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    mockSort = vi.fn();
    mockLimit = vi.fn();

    mockSort.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([]);
    // Force Vitest to re-mock the BookModel for this test
    vi.doMock("../../src/models/reviewModel.js", () => ({
      ReviewModel: {
        create: vi.fn(),
        find: vi.fn(() => ({ populate: vi.fn(() => ({ sort: mockSort })) })),
        findOne: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
        aggregate: vi.fn(() => []),
        collection: { name: "reviews" },
      },
    }));
    vi.doMock("../../src/models/bookModel.js", () => ({
      BookModel: {
        create: vi.fn(),
        find: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
      },
    }));

    // Re-import the modules after mocking
    const { ReviewModel: MockedReviewModel } = await import(
      "../../src/models/reviewModel.js"
    );
    const { BookModel: MockedBookModel } = await import(
      "../../src/models/bookModel.js"
    );
    const serviceModule = await import("../../src/services/reviewService.js");

    BookModel = MockedBookModel;
    ReviewModel = MockedReviewModel;
    reviewService = serviceModule;
  });

  describe("getReviewsOfBook", () => {
    test("returns paginated reviews with pageInfo (first page)", async () => {
      const docs = [{ _id: 5 }, { _id: 4 }, { _id: 3 }];

      mockLimit.mockResolvedValue([...docs]);

      const result = await reviewService.getReviewsOfBook("book123", {});

      // ReviewModel.find() should include findCriteria added internally
      expect(ReviewModel.find).toHaveBeenCalledWith({
        bookId: "book123",
      });

      expect(mockSort).toHaveBeenCalledWith({ _id: -1 });
      expect(result.reviews).toEqual(docs);

      expect(result.pageInfo).toEqual({
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: 3,
        prevCursor: 5,
      });
    });

    test("applies forward pagination using 'after' cursor", async () => {
      const docs = [{ _id: 7 }, { _id: 6 }, { _id: 5 }];

      mockLimit.mockResolvedValue([...docs]);

      const result = await reviewService.getReviewsOfBook("book123", {
        after: 10,
        limit: 2,
      });

      expect(ReviewModel.find).toHaveBeenCalledWith({
        bookId: "book123",
        _id: { $lt: 10 },
      });

      expect(result.reviews).toEqual(docs.slice(0, -1));
      expect(result.pageInfo.prevCursor).toBe(7);
      expect(result.pageInfo.nextCursor).toBe(6);
      expect(result.pageInfo.hasPrevPage).toBe(true);
      expect(result.pageInfo.hasNextPage).toBe(true);
    });

    test("applies backward pagination using 'before' cursor", async () => {
      const docs = [{ _id: 30 }, { _id: 20 }, { _id: 10 }];

      mockLimit.mockResolvedValue([...docs]);

      const result = await reviewService.getReviewsOfBook("book123", {
        before: 50,
        limit: 2,
      });

      expect(ReviewModel.find).toHaveBeenCalledWith({
        bookId: "book123",
        _id: { $gt: 50 },
      });

      expect(result.reviews).toEqual([...docs.slice(0, -1)].reverse());

      expect(result.pageInfo.prevCursor).toBe(20);
      expect(result.pageInfo.nextCursor).toBe(30);
      expect(result.pageInfo.hasPrevPage).toBe(true);
      expect(result.pageInfo.hasNextPage).toBe(true);
    });

    test("handles empty result", async () => {
      mockLimit.mockResolvedValue([]);

      const result = await reviewService.getReviewsOfBook("book123", {});

      expect(result.reviews).toEqual([]);
      expect(result.pageInfo).toEqual({
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: null,
        prevCursor: null,
      });
    });
  });

  describe("isBookReviewed", () => {
    test("should return false if user hasn't reviewed the book", async () => {
      const currUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      ReviewModel.findOne.mockResolvedValue(null);

      const isReviewed = await reviewService.isBookReviewed(
        currUserId,
        fakeBookId
      );

      expect(ReviewModel.findOne).toBeCalledWith({
        user: currUserId,
        book: fakeBookId,
      });
      expect(isReviewed).toBe(false);
    });

    test("should return true if user has reviewed the book", async () => {
      const currUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      ReviewModel.findOne.mockResolvedValue({
        user: currUserId,
        book: fakeBookId,
        rating: 3.5,
        comment: "this is so med",
      });

      const isReviewed = await reviewService.isBookReviewed(
        currUserId,
        fakeBookId
      );

      expect(ReviewModel.findOne).toBeCalledWith({
        user: currUserId,
        book: fakeBookId,
      });
      expect(isReviewed).toBe(true);
    });
  });

  describe("createReview", () => {
    test("create a new review and return it", async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      const fakeReview = {
        user: fakeUserId,
        book: fakeBookId,
        rating: 3.5,
        comment: "this is so med",
      };

      BookModel.findByIdAndUpdate.mockResolvedValue(fakeReview);
      ReviewModel.create.mockResolvedValue(fakeReview);

      const review = await reviewService.createReview(fakeReview);
      expect(ReviewModel.create).toBeCalledWith(fakeReview);
      expect(review).toEqual(fakeReview);
    });
  });
  describe("getReviewById", () => {
    test("fetches a review by its mongo id", async () => {
      const fakeReviewId = new mongoose.Types.ObjectId().toString();
      const fakeReview = {
        _id: fakeReviewId,
        user: "123",
        book: "123",
        rating: 3.5,
        comment: "this is so med",
      };

      ReviewModel.findById.mockResolvedValue(fakeReview);

      const review = await reviewService.getReviewById(fakeReviewId);
      expect(review).toEqual(fakeReview);
    });
  });
  describe("updateReview", () => {
    test("updates a review by its mongo id and returns the updated version", async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      const fakReviewId = new mongoose.Types.ObjectId().toString();
      const fakeReview = {
        _id: fakReviewId,
        user: fakeUserId,
        book: fakeBookId,
        rating: 3.5,
        comment: "this is so med",
      };
      ReviewModel.findByIdAndUpdate.mockResolvedValue(fakeReview);

      const review = await reviewService.updateReview(fakReviewId, {
        comment: "this is so good!",
      });
      expect(review).toEqual(fakeReview);
    });

    test("fails if no review is found with provided id", async () => {
      const fakReviewId = new mongoose.Types.ObjectId().toString();

      ReviewModel.findByIdAndUpdate.mockResolvedValue(null);

      expect(
        reviewService.updateReview(fakReviewId, {
          comment: "this is so good!",
        })
      ).rejects.toThrow(
        expect.objectContaining({
          message: "Review not found",
        })
      );
    });
  });

  describe("deleteReview", () => {
    test("deletes a review by its mongo id and returns the deleted document", async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      const fakReviewId = new mongoose.Types.ObjectId().toString();
      const fakeReview = {
        _id: fakReviewId,
        user: fakeUserId,
        book: fakeBookId,
        rating: 3.5,
        comment: "this is so med",
      };
      ReviewModel.findByIdAndDelete.mockResolvedValue(fakeReview);

      const review = await reviewService.deleteReview(fakReviewId);
      expect(ReviewModel.findByIdAndDelete).toHaveBeenCalledWith(fakReviewId);
      expect(review).toEqual(fakeReview);
    });
  });
});
