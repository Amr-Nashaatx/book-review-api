import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors/AppError.js";
import { asyncHandler } from "./asyncHandler.js";
import { UserModel } from "../models/userModel.js";

export const auth = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AppError("Unauthorized", 401);
  }
  const token = req.headers.authorization.split(" ")[1];
  const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!isValidToken) throw new AppError("Inavalid token", 401);
  const { userId } = jwt.decode(token);
  const user = await UserModel.findById(userId);
  if (!user)
    throw new new AppError("No user associated with this token", 400)();
  req.user = user;
  next();
});
