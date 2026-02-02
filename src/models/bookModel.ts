import mongoose, { Schema, Document } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  isbn?: string;
  publishedYear: number;
  averageRating?: number;
  description?: string;
  coverImage?: string;
  coverPublicId?: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
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
      min: 1450,
      max: new Date().getFullYear(),
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
      type: Schema.Types.ObjectId,
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

export const BookModel = mongoose.model<IBook>("Book", bookSchema);
