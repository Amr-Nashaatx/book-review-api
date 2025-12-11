import mongoose from "mongoose";
import { BookModel } from "../models/bookModel.js";
import { ReviewModel } from "../models/reviewModel.js";
import { AppError } from "../utils/errors/AppError.js";
import { fetchPaginatedData } from "../utils/pagination.js";
import Redis from "ioredis";
import { CloudinaryProvider } from "./storage/CloundinaryProvider.js";

const redis = new Redis({
  host: "redis",
  port: 6379,
});

export const createBook = async (data) => {
  const book = await BookModel.create(data);
  return book;
};

export const getBooks = async (paginationParameters) => {
  const result = fetchPaginatedData(BookModel, paginationParameters);
  return result;
};

export const getGenres = async () => {
  const listKey = `books:genres`;
  const ttl = 3600; // 1 hour;
  const cachedGenres = await redis.lrange(listKey, 0, -1);
  if (!cachedGenres.length) {
    const result = await BookModel.aggregate([
      {
        $group: {
          _id: "$genre",
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
        },
      },
    ]);
    const geners = result.map((g) => g.genre);
    await redis.multi().expire(listKey, ttl).rpush(listKey, geners).exec();
    return geners;
  }
  return cachedGenres;
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
  const useTransactions = process.env.NODE_ENV !== "test";
  let session = null;

  if (useTransactions) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  let deleted = null;

  try {
    deleted = await BookModel.findByIdAndDelete(id);
    if (!deleted) throw new AppError("Book not found", 404);

    await ReviewModel.deleteOne(
      { book: deleted._id },
      useTransactions ? { session } : {}
    );

    if (useTransactions) {
      await session.commitTransaction();
      session.endSession();
    }
  } catch (err) {
    if (useTransactions) {
      await session.abortTransaction();
      session.endSession();
    }
    throw err;
  }

  return deleted;
};

export const uploadBookCover = async (id, fileBuffer) => {
  const storageProvider = new CloudinaryProvider();

  const book = await BookModel.findById(id);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (book.coverPublicId) {
    await storageProvider.deleteImage(book.coverPublicId);
  }

  const result = await storageProvider.uploadImage(fileBuffer, "book-covers");

  const updatedBook = await BookModel.findByIdAndUpdate(
    id,
    {
      coverImage: result.secure_url,
      coverPublicId: result.public_id,
    },
    { new: true }
  );

  return updatedBook;
};
