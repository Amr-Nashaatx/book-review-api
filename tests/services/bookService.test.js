import { describe, test, expect, beforeEach, vi } from "vitest";
import mongoose from "mongoose";

let createBook, getBooks, getBookById, updateBook, deleteBook, getMyBooks;
let BookModel;

let mockLimit, mockSort;
describe("Book Service", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();

    mockSort = vi.fn();
    mockLimit = vi.fn();

    mockSort.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([]);

    // Force Vitest to re-mock the BookModel for this test
    vi.doMock("../../src/models/bookModel.js", () => ({
      BookModel: {
        create: vi.fn(),
        find: vi.fn().mockReturnValue({ sort: mockSort }),
        findById: vi.fn(),
        findOne: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
        collection: { name: "books" },
      },
    }));

    vi.doMock("../../src/models/reviewModel.js", () => ({
      ReviewModel: {
        findByIdAndDelete: vi.fn(),
        deleteOne: vi.fn(),
      },
    }));

    // Re-import the modules after mocking
    const { BookModel: MockedBookModel } = await import(
      "../../src/models/bookModel.js"
    );
    const serviceModule = await import("../../src/services/bookService.js");

    BookModel = MockedBookModel;
    createBook = serviceModule.createBook;
    getBooks = serviceModule.getBooks;
    getBookById = serviceModule.getBookById;
    updateBook = serviceModule.updateBook;
    deleteBook = serviceModule.deleteBook;
    getMyBooks = serviceModule.getMyBooks;
  });

  const testBook = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    genre: "Software Engineering",
    description: "a book description",
    createdBy: new mongoose.Types.ObjectId().toString(),
    publishedYear: 1999,
  };

  test("createBook creates a new book", async () => {
    BookModel.create.mockResolvedValue(testBook);
    const result = await createBook(testBook);
    expect(BookModel.create).toHaveBeenCalledWith(testBook);
    expect(result).toEqual(testBook);
  });

  describe("getBooks", () => {
    test("returns paginated books with pageInfo (first page)", async () => {
      const docs = [{ _id: 5 }, { _id: 4 }, { _id: 3 }];

      mockLimit.mockResolvedValue([...docs]);

      const result = await getBooks({});

      expect(BookModel.find).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ _id: -1 }); // default -_id
      expect(result.books).toEqual(docs);

      expect(result.pageInfo).toEqual({
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: 3,
        prevCursor: 5,
      });
    });
    test("applies forward pagination using 'after' cursor", async () => {
      const docs = [{ _id: 7 }, { _id: 6 }, { _id: 5 }];

      mockLimit.mockResolvedValue(docs);

      const result = await getBooks({ after: 10, limit: 2 });

      expect(BookModel.find).toHaveBeenCalledWith({
        _id: { $lt: 10 }, // since sort = -_id
      });

      expect(result.books).toEqual(docs);
      expect(result.pageInfo.prevCursor).toBe(7);
      expect(result.pageInfo.nextCursor).toBe(6);
      expect(result.pageInfo.hasPrevPage).toBe(true);
      expect(result.pageInfo.hasNextPage).toBe(true);
    });
    test("applies backward pagination using 'before' cursor", async () => {
      const docs = [{ _id: 30 }, { _id: 20 }, { _id: 10 }];

      mockLimit.mockResolvedValue([...docs]);

      const result = await getBooks({ before: 50, limit: 2 });

      expect(BookModel.find).toHaveBeenCalledWith({
        _id: { $gt: 50 }, // backward in -_id flips comparison
      });

      // After reverse()
      docs.pop();
      expect(result.books).toEqual([...docs].reverse());

      expect(result.pageInfo.prevCursor).toBe(20);
      expect(result.pageInfo.nextCursor).toBe(30);
      expect(result.pageInfo.hasPrevPage).toBe(true);
      expect(result.pageInfo.hasNextPage).toBe(true);
    });

    test("handles empty result", async () => {
      mockLimit.mockResolvedValue([]);

      const result = await getBooks({});

      expect(result.books).toEqual([]);
      expect(result.pageInfo).toEqual({
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: null,
        prevCursor: null,
      });
    });
  });

  test("getBookById returns a book if found", async () => {
    BookModel.findById.mockResolvedValue(testBook);
    const result = await getBookById(testBook._id);
    expect(BookModel.findById).toHaveBeenCalledWith(testBook._id);
    expect(result).toEqual(testBook);
  });

  test("getBookById throws error if book not found", async () => {
    BookModel.findById.mockResolvedValue(null);
    await expect(getBookById(new mongoose.Types.ObjectId())).rejects.toThrow(
      expect.objectContaining({
        status: "fail",
        message: "Book not found",
        statusCode: 404,
      })
    );
  });

  test("updateBook updates the book and returns the updated document", async () => {
    const updated = { ...testBook, title: "Updated Book" };
    BookModel.findByIdAndUpdate.mockResolvedValue(updated);
    const result = await updateBook(testBook._id, { title: "Updated Book" });
    expect(BookModel.findByIdAndUpdate).toHaveBeenCalledWith(
      testBook._id,
      { title: "Updated Book" },
      { new: true }
    );
    expect(result).toEqual(updated);
  });

  describe("deleteBook", () => {
    test("deletes and returns the deleted book", async () => {
      BookModel.findByIdAndDelete.mockResolvedValue(testBook);
      const result = await deleteBook(testBook._id);
      expect(BookModel.findByIdAndDelete).toHaveBeenCalledWith(testBook._id);
      expect(result).toEqual(testBook);
    });

    test("throws error if book not found", async () => {
      BookModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(deleteBook(new mongoose.Types.ObjectId())).rejects.toThrow(
        expect.objectContaining({
          status: "fail",
          message: "Book not found",
          statusCode: 404,
        })
      );
    });
  });
  describe("getMyBooks", () => {
    test.only("Returns all books created by user", async () => {
      const mockBooks = [testBook];
      BookModel.findOne.mockResolvedValue(mockBooks);

      const result = await getMyBooks("fake-user-id");

      expect(BookModel.findOne).toHaveBeenCalledWith({
        createdBy: "fake-user-id",
      });
      expect(result).toEqual(mockBooks);
    });
  });
});
