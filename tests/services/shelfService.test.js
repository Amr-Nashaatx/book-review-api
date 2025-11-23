import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

describe("Shelf Service", () => {
  let createShelf, getShelves, getShelfById, updateShelf, deleteShelf, addBookToShelf, removeBookFromShelf;
  let ShelfModel;

  const userId = new mongoose.Types.ObjectId().toString();
  const shelfId = new mongoose.Types.ObjectId().toString();
  const bookId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    vi.resetModules();
    
    ShelfModel = {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneAndUpdate: vi.fn(),
      findOneAndDelete: vi.fn(),
    };

    vi.doMock("../../src/models/shelfModel.js", () => ({
      ShelfModel: ShelfModel,
    }));

    const service = await import("../../src/services/shelfService.js");
    createShelf = service.createShelf;
    getShelves = service.getShelves;
    getShelfById = service.getShelfById;
    updateShelf = service.updateShelf;
    deleteShelf = service.deleteShelf;
    addBookToShelf = service.addBookToShelf;
    removeBookFromShelf = service.removeBookFromShelf;
  });

  describe("createShelf", () => {
    it("should create a new shelf", async () => {
      const data = { name: "My Shelf" };
      const mockShelf = { ...data, user: userId, _id: shelfId };
      ShelfModel.create.mockResolvedValue(mockShelf);

      const result = await createShelf(userId, data);

      expect(ShelfModel.create).toHaveBeenCalledWith({ ...data, user: userId });
      expect(result).toEqual(mockShelf);
    });
  });

  describe("getShelves", () => {
    it("should return all shelves for a user", async () => {
      const mockShelves = [{ name: "Shelf 1" }, { name: "Shelf 2" }];
      ShelfModel.find.mockResolvedValue(mockShelves);

      const result = await getShelves(userId);

      expect(ShelfModel.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(mockShelves);
    });
  });

  describe("getShelfById", () => {
    it("should return a shelf by id", async () => {
      const mockShelf = { _id: shelfId, user: userId, books: [] };
      const populateMock = vi.fn().mockResolvedValue(mockShelf);
      ShelfModel.findOne.mockReturnValue({ populate: populateMock });

      const result = await getShelfById(userId, shelfId);

      expect(ShelfModel.findOne).toHaveBeenCalledWith({ _id: shelfId, user: userId });
      expect(populateMock).toHaveBeenCalledWith("books");
      expect(result).toEqual(mockShelf);
    });

    it("should throw error if shelf not found", async () => {
      const populateMock = vi.fn().mockResolvedValue(null);
      ShelfModel.findOne.mockReturnValue({ populate: populateMock });

      await expect(getShelfById(userId, shelfId)).rejects.toMatchObject({
        message: "Shelf not found",
        statusCode: 404,
      });
    });

    it("should throw error if book already in shelf", async () => {
      const mockShelf = {
        _id: shelfId,
        user: userId,
        books: [bookId],
      };
      ShelfModel.findOne.mockResolvedValue(mockShelf);

      await expect(addBookToShelf(userId, shelfId, bookId)).rejects.toMatchObject({
        message: "Book already in shelf",
        statusCode: 400,
      });
    });
  });

  describe("removeBookFromShelf", () => {
    it("should remove a book from a shelf", async () => {
      const mockShelf = {
        _id: shelfId,
        user: userId,
        books: [bookId],
        save: vi.fn(),
      };
      ShelfModel.findOne.mockResolvedValue(mockShelf);

      await removeBookFromShelf(userId, shelfId, bookId);

      expect(mockShelf.books).not.toContain(bookId);
      expect(mockShelf.save).toHaveBeenCalled();
    });
  });
});
