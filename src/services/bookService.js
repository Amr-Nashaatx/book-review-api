import { BookModel } from "../models/bookModel.js";
import { AppError } from "../utils/errors/AppError.js";

export const createBook = async (data) => {
  const book = await BookModel.create(data);
  return book;
};

export const getBooks = async () => {
  return await BookModel.find({});
};

export const getBookById = async (id) => {
  const book = await BookModel.findById(id);
  if (!book) throw new AppError("Book not found", 404);
  return book;
};

export const updateBook = async (id, updates) => {
  const updated = await BookModel.findByIdAndUpdate(id, updates, { new: true });
  if (!updated) throw new AppError("Book not found", 404);
  return updated;
};

export const deleteBook = async (id) => {
  const deleted = await BookModel.findByIdAndDelete(id);
  if (!deleted) throw new AppError("Book not found", 404);
  return deleted;
};
