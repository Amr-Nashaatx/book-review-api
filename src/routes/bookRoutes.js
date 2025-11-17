import express from "express";
import {
  createBookController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getBooksController,
  getGenresController,
} from "../controllers/bookController.js";
import {
  validateCreateBook,
  validateUpdateBook,
} from "../middlewares/bookValidators.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
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
 *                   example:
 *                     status: success
 *                     data:
 *                       books:
 *                         - _id: 64ff1ac2b72d3a10f7e3c9a4
 *                           title: The Hobbit
 *                           author: J.R.R. Tolkien
 *                           genre: Fantasy
 *                           description: A fantasy novel about Bilbo Baggins
 *                           publishedYear: 1937
 *                           averageRating: 4.9
 *                         - _id: 64ff1ac2b72d3a10f7e3c9b1
 *                           title: Clean Code
 *                           author: Robert C. Martin
 *                           genre: Software Engineering
 *                           description: A handbook of agile software craftsmanship
 *                           publishedYear: 2008
 *                           averageRating: 4.7
 *                     message: books fetched successfully
 *
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookPayload"
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
 *                   example:
 *                     status: success
 *                     data:
 *                       book:
 *                         _id: 64ff1ac2b72d3a10f7e3c9a4
 *                         title: The Hobbit
 *                         author: J.R.R. Tolkien
 *                         genre: Fantasy
 *                         description: A fantasy novel about Bilbo Baggins
 *                         publishedYear: 1937
 *                         averageRating: 0
 *                     message: book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router
  .route("/")
  .get(getBooksController)
  .post(auth, validateCreateBook, createBookController);

router.get("/genres", getGenresController);
/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
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
 *                   example:
 *                     status: success
 *                     data:
 *                       book:
 *                         _id: 64ff1ac2b72d3a10f7e3c9a4
 *                         title: The Hobbit
 *                         author: J.R.R. Tolkien
 *                         genre: Fantasy
 *                         description: A fantasy novel about Bilbo Baggins
 *                         publishedYear: 1937
 *                         averageRating: 4.9
 *                     message: book fetched successfully
 *       404:
 *         description: Book not found
 *
 *   put:
 *     summary: Update an existing book
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookUpdatePayload"
 *     responses:
 *       200:
 *         description: Updated book data
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
 *                   example:
 *                     status: success
 *                     data:
 *                       book:
 *                         _id: 64ff1ac2b72d3a10f7e3c9a4
 *                         title: Clean Code (Updated)
 *                         author: Robert C. Martin
 *                         genre: Software Engineering
 *                         description: Updated edition
 *                         publishedYear: 2008
 *                         averageRating: 4.7
 *                     message: book updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   example:
 *                     status: success
 *                     data: {}
 *                     message: book deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router
  .route("/:id")
  .get(getBookByIdController)
  .put(auth, validateUpdateBook, updateBookController)
  .delete(auth, deleteBookController);

export default router;
