import mongoose from "mongoose";
import { describe, test, expect, beforeEach, vi } from "vitest";

let reviewService;
let ReviewModel, BookModel;

describe("Review Service", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    // Force Vitest to re-mock the BookModel for this test
    vi.doMock("../../src/models/reviewModel.js", () => ({
      ReviewModel: {
        create: vi.fn(),
        find: vi.fn(),
        findOne: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
        aggregate: vi.fn(() => []),
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

  describe("getReviewOfBook", () => {
    test("should return array of all books", async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeBookId = new mongoose.Types.ObjectId().toString();
      const fakeReviews = [
        {
          user: fakeUserId,
          book: fakeBookId,
          rating: 3.5,
          comment: "this is so med",
        },
      ];
      ReviewModel.find.mockResolvedValue(fakeReviews);

      const reviews = await reviewService.getReviewsOfBook(fakeBookId);

      expect(ReviewModel.find).toBeCalledWith({
        book: new mongoose.Types.ObjectId(fakeBookId),
      });

      expect(reviews[0]).toMatchObject(fakeReviews[0]);
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
        user: new mongoose.Types.ObjectId(currUserId),
        book: new mongoose.Types.ObjectId(fakeBookId),
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
        user: new mongoose.Types.ObjectId(currUserId),
        book: new mongoose.Types.ObjectId(fakeBookId),
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
