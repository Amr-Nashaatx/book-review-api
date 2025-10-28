import { describe, test, expect, beforeEach, vi } from "vitest";
import mongoose from "mongoose";

let createBook, getBooks, getBookById, updateBook, deleteBook;
let BookModel;

describe("Book Service", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    // Force Vitest to re-mock the BookModel for this test
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

  test("getBooks returns the list of books", async () => {
    BookModel.find.mockResolvedValue([testBook]);
    const result = await getBooks();
    expect(BookModel.find).toHaveBeenCalled();
    expect(result).toEqual([testBook]);
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

  test("deleteBook deletes and returns the deleted book", async () => {
    BookModel.findByIdAndDelete.mockResolvedValue(testBook);
    const result = await deleteBook(testBook._id);
    expect(BookModel.findByIdAndDelete).toHaveBeenCalledWith(testBook._id);
    expect(result).toEqual(testBook);
  });

  test("deleteBook throws error if book not found", async () => {
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
