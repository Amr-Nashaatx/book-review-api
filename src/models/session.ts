import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface ISession extends Document {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: {
    type: String,
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revokedAt: {
    type: Date,
  },
});

sessionSchema.pre<ISession>("save", async function (next) {
  if (!this.isModified("refreshTokenHash")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.refreshTokenHash = await bcrypt.hash(this.refreshTokenHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Session = mongoose.model<ISession>("session", sessionSchema);
