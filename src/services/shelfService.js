import { ShelfModel } from "../models/shelfModel.js";
import { AppError } from "../utils/errors/AppError.js";

export const createShelf = async (userId, data) => {
  const shelf = await ShelfModel.create({ ...data, user: userId });
  return shelf;
};

export const getShelves = async (userId) => {
  const shelves = await ShelfModel.aggregate([
    {
      $match: { user: userId },
    },
    {
      $addFields: {
        booksCount: { $size: "$books" },
      },
    },
  ]);
  return shelves;
};

export const getShelfById = async (userId, shelfId) => {
  const shelf = await ShelfModel.findOne({
    _id: shelfId,
    user: userId,
  }).populate("books");
  if (!shelf) throw new AppError("Shelf not found", 404);
  return shelf;
};

export const updateShelf = async (userId, shelfId, updates) => {
  const shelf = await ShelfModel.findOneAndUpdate(
    { _id: shelfId, user: userId },
    updates,
    { new: true }
  );
  if (!shelf) throw new AppError("Shelf not found", 404);
  return shelf;
};

export const deleteShelf = async (userId, shelfId) => {
  const shelf = await ShelfModel.findOneAndDelete({
    _id: shelfId,
    user: userId,
  });
  if (!shelf) throw new AppError("Shelf not found", 404);
  return shelf;
};

export const addBookToShelf = async (userId, shelfId, bookId) => {
  const shelf = await ShelfModel.findOne({ _id: shelfId, user: userId });
  if (!shelf) throw new AppError("Shelf not found", 404);

  if (shelf.books.includes(bookId)) {
    throw new AppError("Book already in shelf", 400);
  }

  shelf.books.push(bookId);
  await shelf.save();
  return shelf;
};

export const removeBookFromShelf = async (userId, shelfId, bookId) => {
  const shelf = await ShelfModel.findOne({ _id: shelfId, user: userId });
  if (!shelf) throw new AppError("Shelf not found", 404);

  shelf.books = shelf.books.filter((id) => id.toString() !== bookId);
  await shelf.save();
  return shelf;
};
