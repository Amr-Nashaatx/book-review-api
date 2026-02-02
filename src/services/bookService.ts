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
redis.on("error", () => {});

export const createBook = async (data: any) => {
  const book = await BookModel.create(data);
  return book;
};

export const getBooks = async (paginationParameters: any) => {
  const result = fetchPaginatedData(BookModel, paginationParameters);
  return result;
};

export const getMyBooks = async (userId: any) => {
  const myBooks = await BookModel.find({ createdBy: userId });
  return myBooks;
};

export const getGenres = async () => {
  const listKey = `books:genres`;
  const ttl = 3600; // 1 hour
  try {
    const cachedGenres = await redis.lrange(listKey, 0, -1);
    if (cachedGenres.length > 0) {
      return cachedGenres;
    }
  } catch {}

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
  const genres = result.map((g: any) => g.genre);
  try {
    if (genres.length > 0) {
      await redis
        .multi()
        .del(listKey)
        .rpush(listKey, ...genres)
        .expire(listKey, ttl)
        .exec();
    }
  } catch {}
  return genres;
};

export const getBookById = async (id: string) => {
  const book = await BookModel.findById(id);
  if (!book) throw new AppError("Book not found", 404);
  return book;
};

export const updateBook = async (id: string, updates: any) => {
  const updated = await BookModel.findByIdAndUpdate(id, updates, { new: true });
  if (!updated) throw new AppError("Book not found", 404);
  return updated;
};

export const deleteBook = async (id: string) => {
  const useTransactions = process.env.NODE_ENV !== "test";
  let session: any = null;

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
      useTransactions ? { session } : {},
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

export const uploadBookCover = async (id: string, fileBuffer: Buffer) => {
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
    { new: true },
  );

  return updatedBook;
};
