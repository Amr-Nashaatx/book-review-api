import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

// Ensure unique shelf names per user
shelfSchema.index({ user: 1, name: 1 }, { unique: true });

/**
 * @openapi
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: ID of the user who owns the shelf
 *         name:
 *           type: string
 *           example: "Want to Read"
 *         description:
 *           type: string
 *           example: "Books I plan to read this year"
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ShelfPayload:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Favorites"
 *         description:
 *           type: string
 *           example: "My all-time favorite books"
 */

export const ShelfModel = mongoose.models.Shelf || mongoose.model("Shelf", shelfSchema);
