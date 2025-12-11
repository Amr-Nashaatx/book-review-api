import express from "express";
import {
  createBookController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getBooksController,
  getGenresController,
  uploadBookCoverController,
} from "../controllers/bookController.js";
import {
  validateCreateBook,
  validateUpdateBook,
} from "../middlewares/bookValidators.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a paginated list of all books in the catalog. Supports filtering and sorting.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: genre
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter books by genre
 *       - in: query
 *         name: author
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter books by author
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         books:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Book'
 *             example:
 *               status: success
 *               data:
 *                 books:
 *                   - _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                     title: "The Hobbit"
 *                     author: "J.R.R. Tolkien"
 *                     genre: "Fantasy"
 *                     description: "A fantasy novel"
 *                     publishedYear: 1937
 *                     averageRating: 4.9
 *               message: "books fetched successfully"
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new book entry
 *     description: Add a new book to the catalog. Requires authentication.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookPayload"
 *           example:
 *             title: "The Hobbit"
 *             author: "J.R.R. Tolkien"
 *             genre: "Fantasy"
 *             publishedYear: 1937
 *             description: "A fantasy novel"
 *             isbn: "978-0547928227"
 *     responses:
 *       201:
 *         description: Book successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         book:
 *                           $ref: '#/components/schemas/Book'
 *             example:
 *               status: success
 *               data:
 *                 book:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   title: "The Hobbit"
 *                   author: "J.R.R. Tolkien"
 *                   genre: "Fantasy"
 *                   publishedYear: 1937
 *                   averageRating: 0
 *               message: "book created successfully"
 *       400:
 *         description: Validation error (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized (authentication required)
 *       500:
 *         description: Internal server error
 */
router
  .route("/")
  .get(getBooksController)
  .post(auth, validateCreateBook, createBookController);

/**
 * @openapi
 * /books/genres:
 *   get:
 *     summary: Get all available genres
 *     description: Retrieve a list of all unique genres in the book catalog.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Fantasy", "Mystery", "Romance", "Science Fiction"]
 *       500:
 *         description: Internal server error
 */
router.get("/genres", getGenresController);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a specific book by ID
 *     description: Retrieve detailed information about a single book.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book found and returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         book:
 *                           $ref: '#/components/schemas/Book'
 *             example:
 *               status: success
 *               data:
 *                 book:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   title: "The Hobbit"
 *                   author: "J.R.R. Tolkien"
 *                   genre: "Fantasy"
 *                   publishedYear: 1937
 *                   averageRating: 4.9
 *               message: "book fetched successfully"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update an existing book
 *     description: Modify book information. Requires authentication.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookUpdatePayload"
 *           example:
 *             title: "The Hobbit (Updated)"
 *             genre: "Fantasy"
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         book:
 *                           $ref: '#/components/schemas/Book'
 *             example:
 *               status: success
 *               data:
 *                 book:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   title: "The Hobbit (Updated)"
 *                   author: "J.R.R. Tolkien"
 *                   genre: "Fantasy"
 *                   publishedYear: 1937
 *                   averageRating: 4.7
 *               message: "book updated successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a book
 *     description: Remove a book from the catalog. Requires authentication.
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: success
 *               data: {}
 *               message: "book deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/:id")
  .get(getBookByIdController)
  .put(auth, validateUpdateBook, updateBookController)
  .delete(auth, deleteBookController);

router.post(
  "/:id/cover",
  auth,
  upload.single("cover"),
  uploadBookCoverController
);

export default router;
