import express from "express";
import {
  getReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviewController.js";
import { auth } from "../middlewares/authMiddleware.js";
import {
  validateCreateReview,
  validateUpdateReview,
} from "../middlewares/reviewValidators.js";

const router = express.Router();

/**
 * @openapi
 * /reviews/book/{bookId}/reviews:
 *   get:
 *     summary: Get all reviews for a book
 *     description: Retrieve all reviews posted for a specific book, including rating and comment.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book
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
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
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
 *                         reviews:
 *                           $ref: '#/components/schemas/ReviewList'
 *             example:
 *               status: success
 *               data:
 *                 reviews:
 *                   - _id: "6532c4a94bd0c4e1f8a2a1d1"
 *                     book: "64ff1ac2b72d3a10f7e3c9a4"
 *                     user: "64ff1ac2b72d3a10f7e3c9a5"
 *                     rating: 5
 *                     comment: "Fantastic read!"
 *                     createdAt: "2023-10-23T15:30:00Z"
 *               message: "reviews fetched successfully"
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a review for a book
 *     description: Post a new review (rating + optional comment) for a book. Requires authentication. One review per user per book.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the book being reviewed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReviewPayload"
 *           example:
 *             rating: 5
 *             comment: "Loved it! A masterpiece."
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                         review:
 *                           $ref: '#/components/schemas/Review'
 *             example:
 *               status: success
 *               data:
 *                 review:
 *                   _id: "6532c4a94bd0c4e1f8a2a1d1"
 *                   book: "64ff1ac2b72d3a10f7e3c9a4"
 *                   user: "64ff1ac2b72d3a10f7e3c9a5"
 *                   rating: 5
 *                   comment: "Loved it! A masterpiece."
 *               message: "review created successfully"
 *       400:
 *         description: Validation error (invalid rating or duplicate review)
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
 */
router.get("/book/:bookId/reviews", getReviewsController);
router.post(
  "/book/:bookId/reviews/",
  auth,
  validateCreateReview,
  createReviewController
);

/**
 * @openapi
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     description: Modify an existing review (rating and/or comment). Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReviewPayload"
 *           example:
 *             rating: 4
 *             comment: "Good book, but the pacing dipped in the middle."
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                         review:
 *                           $ref: '#/components/schemas/Review'
 *             example:
 *               status: success
 *               data:
 *                 review:
 *                   _id: "6532c4a94bd0c4e1f8a2a1d1"
 *                   book: "64ff1ac2b72d3a10f7e3c9a4"
 *                   user: "64ff1ac2b72d3a10f7e3c9a5"
 *                   rating: 4
 *                   comment: "Good book, but the pacing dipped in the middle."
 *               message: "review updated successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a review by ID
 *     description: Remove a review. Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the review
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: success
 *               data: {}
 *               message: "review deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", auth, validateUpdateReview, updateReviewController);
router.delete("/:id", auth, deleteReviewController);

export default router;
