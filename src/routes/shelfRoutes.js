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
 *     tags: [Shelves]
 *     responses:
 *       200:
 *         description: List of shelves
 *   post:
 *     summary: Create a new shelf
 *     tags: [Shelves]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ShelfPayload"
 *     responses:
 *       201:
 *         description: Shelf created
 */
router.route("/").get(getShelvesController).post(createShelfController);

/**
 * @openapi
 * /shelves/{id}:
 *   get:
 *     summary: Get a specific shelf
 *     tags: [Shelves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shelf details
 *   put:
 *     summary: Update a shelf
 *     tags: [Shelves]
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
 *             $ref: "#/components/schemas/ShelfPayload"
 *     responses:
 *       200:
 *         description: Shelf updated
 *   delete:
 *     summary: Delete a shelf
 *     tags: [Shelves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shelf deleted
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
 *     tags: [Shelves]
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
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added to shelf
 */
router.route("/:id/books").post(addBookToShelfController);

/**
 * @openapi
 * /shelves/{id}/books/{bookId}:
 *   delete:
 *     summary: Remove a book from a shelf
 *     tags: [Shelves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from shelf
 */
router.route("/:id/books/:bookId").delete(removeBookFromShelfController);

export default router;
