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

router.get("/book/:bookId/reviews", getReviewsController);
router.post(
  "/book/:bookId/reviews/",
  auth,
  validateCreateReview,
  createReviewController,
);

router.put("/:id", auth, validateUpdateReview, updateReviewController);
router.delete("/:id", auth, deleteReviewController);

export default router;
