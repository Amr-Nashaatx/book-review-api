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
  { timestamps: true },
);

// Ensure unique shelf names per user
shelfSchema.index({ user: 1, name: 1 }, { unique: true });

export const ShelfModel =
  mongoose.models.Shelf || mongoose.model("Shelf", shelfSchema);
