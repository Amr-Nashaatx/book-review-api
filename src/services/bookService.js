import mongoose from "mongoose";
import { BookModel } from "../models/bookModel.js";
import { ReviewModel } from "../models/reviewModel.js";
import { AppError } from "../utils/errors/AppError.js";
import { fetchPaginatedData } from "../utils/pagination.js";

export const createBook = async (data) => {
  const book = await BookModel.create(data);
  return book;
};

export const getBooks = async (paginationParameters) => {
  const result = fetchPaginatedData(BookModel, paginationParameters);
  return result;
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deleted = await BookModel.findByIdAndDelete(id);
    if (!deleted) throw new AppError("Book not found", 404);
    await ReviewModel.deleteOne({ book: deleted._id }, { session });
    await session.commitTransaction();
    session.endSession();
    return deleted;
  } catch (err) {
    await session.abortTransaction();
  }
};
