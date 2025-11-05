import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
    },
    publishedYear: {
      type: Number,
      required: true,
      min: 1450, // Assuming books were published after 1450
      max: new Date().getFullYear(), // Current year
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: The Hobbit
 *         author:
 *           type: string
 *           example: J.R.R. Tolkien
 *         genre:
 *           type: string
 *           example: Fantasy
 *         description:
 *           type: string
 *           example: A fantasy adventure novel.
 *         publishedYear:
 *           type: integer
 *           example: 1937
 *         averageRating:
 *           type: number
 *           example: 4.8
 *         createdBy:
 *           type: string
 *           description: ObjectId of the user who created the book
 *
 *     BookPayload:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - genre
 *         - publishedYear
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         description:
 *           type: string
 *         publishedYear:
 *           type: integer
 *
 *     BookUpdatePayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         description:
 *           type: string
 *         publishedYear:
 *           type: integer
 */

export const BookModel = mongoose.model("Book", bookSchema);
