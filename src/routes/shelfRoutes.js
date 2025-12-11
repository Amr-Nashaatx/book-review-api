import express from "express";
import {
  createShelfController,
  getShelvesController,
  getShelfByIdController,
  updateShelfController,
  deleteShelfController,
  addBookToShelfController,
  removeBookFromShelfController,
} from "../controllers/shelfController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(auth); // All shelf routes require authentication

/**
 * @openapi
 * /shelves:
 *   get:
 *     summary: Get all shelves for the logged-in user
 *     description: Retrieve all personal shelves created by the authenticated user.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Shelves retrieved successfully
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
 *                         shelves:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Shelf'
 *             example:
 *               status: success
 *               data:
 *                 shelves:
 *                   - _id: "64ff1ac2b72d3a10f7e3c9a6"
 *                     user: "64ff1ac2b72d3a10f7e3c9a4"
 *                     name: "Want to Read"
 *                     description: "Books I plan to read this year"
 *                     books: ["64ff1ac2b72d3a10f7e3c9a4", "64ff1ac2b72d3a10f7e3c9a5"]
 *               message: "shelves fetched successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new shelf
 *     description: Create a new personal shelf for organizing books.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ShelfPayload"
 *           example:
 *             name: "Favorites"
 *             description: "My all-time favorite books"
 *     responses:
 *       201:
 *         description: Shelf created successfully
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
 *                         shelf:
 *                           $ref: '#/components/schemas/Shelf'
 *             example:
 *               status: success
 *               data:
 *                 shelf:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a6"
 *                   user: "64ff1ac2b72d3a10f7e3c9a4"
 *                   name: "Favorites"
 *                   description: "My all-time favorite books"
 *                   books: []
 *               message: "shelf created successfully"
 *       400:
 *         description: Validation error or duplicate shelf name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.route("/").get(getShelvesController).post(createShelfController);

/**
 * @openapi
 * /shelves/{id}:
 *   get:
 *     summary: Get a specific shelf by ID
 *     description: Retrieve detailed information about a single shelf and its books.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shelf
 *     responses:
 *       200:
 *         description: Shelf retrieved successfully
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
 *                         shelf:
 *                           $ref: '#/components/schemas/Shelf'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shelf not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a shelf
 *     description: Modify shelf name and/or description.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shelf
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ShelfPayload"
 *           example:
 *             name: "Updated Shelf Name"
 *             description: "Updated description"
 *     responses:
 *       200:
 *         description: Shelf updated successfully
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
 *                         shelf:
 *                           $ref: '#/components/schemas/Shelf'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shelf not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a shelf
 *     description: Remove a shelf and all its associations.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shelf
 *     responses:
 *       200:
 *         description: Shelf deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: success
 *               data: {}
 *               message: "shelf deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shelf not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/:id")
  .get(getShelfByIdController)
  .put(updateShelfController)
  .delete(deleteShelfController);

/**
 * @openapi
 * /shelves/{id}/books:
 *   post:
 *     summary: Add a book to a shelf
 *     description: Add an existing book to a shelf by book ID.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shelf
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: MongoDB ObjectId of the book to add
 *                 example: "64ff1ac2b72d3a10f7e3c9a4"
 *     responses:
 *       200:
 *         description: Book successfully added to shelf
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
 *                         shelf:
 *                           $ref: '#/components/schemas/Shelf'
 *             example:
 *               status: success
 *               data:
 *                 shelf:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a6"
 *                   name: "Want to Read"
 *                   books: ["64ff1ac2b72d3a10f7e3c9a4", "64ff1ac2b72d3a10f7e3c9a5"]
 *               message: "book added to shelf successfully"
 *       400:
 *         description: Validation error (book already on shelf)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shelf or book not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id/books").post(addBookToShelfController);

/**
 * @openapi
 * /shelves/{id}/books/{bookId}:
 *   delete:
 *     summary: Remove a book from a shelf
 *     description: Delete a book from a shelf without deleting the book itself.
 *     tags: [Shelves]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shelf
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book to remove
 *     responses:
 *       200:
 *         description: Book successfully removed from shelf
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
 *                         shelf:
 *                           $ref: '#/components/schemas/Shelf'
 *             example:
 *               status: success
 *               data:
 *                 shelf:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a6"
 *                   name: "Want to Read"
 *                   books: ["64ff1ac2b72d3a10f7e3c9a5"]
 *               message: "book removed from shelf successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shelf or book not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id/books/:bookId").delete(removeBookFromShelfController);

export default router;
