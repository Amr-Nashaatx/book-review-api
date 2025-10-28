/**
 * @module Routes/Books
 * @description Defines routes for managing books within the API.
 */

import express from "express";
import {
  createBookController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getBooksController,
} from "../controllers/bookController.js";
import {
  validateCreateBook,
  validateUpdateBook,
} from "../middlewares/bookValidators.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/books
 * @summary Fetch all books
 * @description Returns a list of books with basic details.
 * @access Public
 * @returns {Array<Book>} 200 - Array of book objects
 */

/**
 * POST /api/books
 * @summary Create a new book
 * @description Adds a new book to the database.
 * Requires user authentication.
 * @access Private (auth required)
 * @param {BookPayload} request.body - Book data (validated)
 * @returns {Book} 201 - Created book object
 */
router
  .route("/")
  .get(getBooksController)
  .post(auth, validateCreateBook, createBookController);

/**
 * GET /api/books/:id
 * @summary Fetch a single book by ID
 * @description Returns details for one specific book.
 * @access Public
 * @param {string} request.params.id - Book ID
 * @returns {Book} 200 - Book object
 * @throws {404} - If book not found
 */

/**
 * PUT /api/books/:id
 * @summary Update a book by ID
 * @description Allows updating book fields such as title, genre, etc.
 * Requires user authentication.
 * @access Private (auth required)
 * @param {string} request.params.id - Book ID
 * @param {BookUpdatePayload} request.body - Updated fields (validated)
 * @returns {Book} 200 - Updated book object
 * @throws {404} - If book not found
 */

/**
 * DELETE /api/books/:id
 * @summary Delete a book by ID
 * @description Removes a book from the database.
 * Requires user authentication.
 * @access Private (auth required)
 * @param {string} request.params.id - Book ID
 * @returns 204 - Book successfully deleted
 * @throws {404} - If book not found
 */
router
  .route("/:id")
  .get(getBookByIdController)
  .put(auth, validateUpdateBook, updateBookController)
  .delete(auth, deleteBookController);

export default router;

/**
 * @typedef Book
 * @property {string} _id - Unique identifier
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} genre - Genre of the book
 * @property {string} description - Book summary or overview
 * @property {number} publishedYear - Year of publication
 * @property {number} averageRating - Average rating (computed)
 */

/**
 * @typedef BookPayload
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} genre - Book genre
 * @property {string} [description] - Brief summary
 * @property {number} publishedYear - Publication year
 */

/**
 * @typedef BookUpdatePayload
 * @property {string} [title]
 * @property {string} [author]
 * @property {string} [genre]
 * @property {string} [description]
 * @property {number} [publishedYear]
 */
