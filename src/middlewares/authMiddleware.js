import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors/AppError.js";
import { asyncHandler } from "./asyncHandler.js";
import { UserModel } from "../models/userModel.js";

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt_token ?? "";
  let isValidToken;
  try {
    isValidToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new AppError("Inavalid token", 401);
  }
  if (!isValidToken) throw new AppError("Inavalid token", 401);
  const { userId } = jwt.decode(token);
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("No user associated with this token", 400);
  req.user = user;
  next();
});
