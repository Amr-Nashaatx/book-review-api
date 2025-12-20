import mongoose from "mongoose";
import bcrypt from "bcrypt";

const sessionSchema = new mongoose.Schema({
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

sessionSchema.pre("save", async function (next) {
  if (!this.isModified("refreshTokenHash")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.refreshTokenHash = await bcrypt.hash(this.refreshTokenHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export const Session = mongoose.model("session", sessionSchema);
