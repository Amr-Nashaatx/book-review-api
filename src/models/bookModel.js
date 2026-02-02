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
    coverImage: {
      type: String,
    },
    coverPublicId: {
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
  { timestamps: true },
);

bookSchema.index({ genre: 1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ publishedYear: -1 });
bookSchema.index({ title: "text", description: "text" });

// bookSchema.index({ createdBy: 1 });

export const BookModel = mongoose.model("Book", bookSchema);
