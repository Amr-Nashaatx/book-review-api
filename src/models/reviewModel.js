import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6532c4a94bd0c4e1f8a2a1d1
 *         book:
 *           type: string
 *           description: ID of the book being reviewed
 *           example: 6532c4a94bd0c4e1f8a2a1d1
 *         user:
 *           type: string
 *           description: ID of the user who wrote the review
 *           example: 6532c4a94bd0c4e1f8a2a1a8
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comment:
 *           type: string
 *           example: "Fantastic read — well paced and beautifully written."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReviewList:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Review'
 */

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

export const ReviewModel = mongoose.model("Review", reviewSchema);
