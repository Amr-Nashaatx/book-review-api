import mongoose, { Schema, Document } from "mongoose";

interface IShelf extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  books: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const shelfSchema = new Schema<IShelf>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true },
);

shelfSchema.index({ user: 1, name: 1 }, { unique: true });

export const ShelfModel =
  mongoose.models.Shelf || mongoose.model<IShelf>("Shelf", shelfSchema);
