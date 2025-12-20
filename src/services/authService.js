import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { AppError } from "../utils/errors/AppError.js";
import {
  signAccessToken,
  sanitizeUser,
  signRefreshToken,
} from "../utils/utils.js";
import { Session } from "../models/session.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

/**
 * Registers a new user and returns the user and JWT token.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string }}
 */
export const registerUser = async (name, email, password) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const newUser = await UserModel.create({ name, email, password });
  const token = signAccessToken(newUser);

  return { user: sanitizeUser(newUser), token };
};

export const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.DEV_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid refresh", 401);
  }

  const session = await Session.findById(payload.sessionId);
  if (!session || session.revokedAt) {
    throw new AppError("No session", 401);
  }

  if (!bcrypt.compare(refreshToken, session.refreshTokenHash)) {
    // token reuse → revoke session
    session.revokedAt = new Date(Date.now());
    await session.save();
    throw new AppError("session revoked", 401);
  }

  // rotate
  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError("User not found", 404);

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(payload.userId, payload.sessionId);

  const salt = await bcrypt.genSalt(10);
  session.refreshTokenHash = await bcrypt.hash(newRefreshToken, salt);

  await session.save();

  return { newRefreshToken, newAccessToken };
};
/**
 * Authenticates a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string, refreshToken: string }}
 */
export const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new AppError("Email or password is wrong", 400);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Email or password is wrong", 400);

  const sessionId = new mongoose.Types.ObjectId();

  const acessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user._id, sessionId);

  await Session.create({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return { user: sanitizeUser(user), token: acessToken, refreshToken };
};
