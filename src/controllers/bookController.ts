import { asyncHandler } from "../middlewares/asyncHandler.js";
import { APIResponse } from "../utils/response.js";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getGenres,
  uploadBookCover,
  getMyBooks,
} from "../services/bookService.js";
import { buildBookFilters } from "../utils/filters.js";
import { AppError } from "../utils/errors/AppError.js";
import { Request, Response, NextFunction } from "express";

export const createBookController = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const book = await createBook({ ...req.body, createdBy: userId });
    const response = new APIResponse("success", "Book created successfully");
    response.addResponseData("book", book);
    res.status(201).json(response);
  },
);

export const getMyBooksController = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const myBooks = await getMyBooks(userId);
    const response = new APIResponse(
      "success",
      "Fetched your books successfully",
    );
    response.addResponseData("books", myBooks);
    res.status(200).json(response);
  },
);

export const uploadBookCoverController = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError("No image uploaded", 400);
    }

    const updatedBook = await uploadBookCover(req.params.id, req.file.buffer);

    const response = new APIResponse(
      "success",
      "Cover image uploaded created successfully",
    );
    response.addResponseData("book", updatedBook);
    res.status(200).json(response);
  },
);

export const getGenresController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const genres = await getGenres();
    const response = new APIResponse("success", "Genres fetched successfully");
    response.addResponseData("genres", genres);
    res.status(200).json(response);
  },
);

export const getBooksController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { after, before, limit, sort = "-_id" } = req.query;
    const filters = buildBookFilters(req.query);
    const paginationParameters = { after, before, limit, sort, filters };
    const { books, pageInfo } = await getBooks(paginationParameters);
    const response = new APIResponse("success", "Books fetched successfully");
    response.addResponseData("books", books);
    response.addResponseData("pageInfo", pageInfo);
    res.status(200).json(response);
  },
);

export const getBookByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const book = await getBookById(req.params.id);
    const response = new APIResponse("success", "Book fetched successfully");
    response.addResponseData("book", book);
    res.status(200).json(response);
  },
);

export const updateBookController = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const book = await updateBook(req.params.id, req.body);
    const response = new APIResponse("success", "Book Updated successfully");
    response.addResponseData("book", book);
    res.status(200).json(response);
  },
);

export const deleteBookController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteBook(req.params.id);
    res
      .status(200)
      .json(new APIResponse("success", "Book deleted successfully"));
  },
);
