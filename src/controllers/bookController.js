import { asyncHandler } from "../middlewares/asyncHandler.js";
import { APIResponse } from "../utils/response.js";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../services/bookService.js";
import { buildBookFilters } from "../utils/filters.js";

export const createBookController = asyncHandler(async (req, res, next) => {
  const { title, author, genre, description, publishedYear } = req.body;
  const userId = req.user._id;
  const book = await createBook({
    title,
    author,
    genre,
    publishedYear,
    description,
    createdBy: userId,
  });
  const response = new APIResponse("success", "Book created successfully");
  response.addResponseData("book", book);
  res.status(201).json(response);
});

export const getBooksController = asyncHandler(async (req, res, next) => {
  const { after, before, limit, sort = "-_id" } = req.query;
  const filters = buildBookFilters(req.query);
  const paginationParameters = { after, before, limit, sort, filters };

  const { books, pageInfo } = await getBooks(paginationParameters);
  const response = new APIResponse("success", "Books fetched successfully");
  response.addResponseData("books", books);
  response.addResponseData("pageInfo", pageInfo);
  res.status(200).json(response);
});

export const getBookByIdController = asyncHandler(async (req, res, next) => {
  const book = await getBookById(req.params.id);
  const response = new APIResponse("success", "Book fetched successfully");
  response.addResponseData("book", book);
  res.status(200).json(response);
});

export const updateBookController = asyncHandler(async (req, res, next) => {
  const book = await updateBook(req.params.id, req.body);
  const response = new APIResponse("success", "Book Updated successfully");
  response.addResponseData("book", book);
  res.status(200).json(response);
});
export const deleteBookController = asyncHandler(async (req, res, next) => {
  await deleteBook(req.params.id);
  res.status(200).json(new APIResponse("sucess", "Book deleted successfully"));
});
