import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AppError } from "../utils/errors/AppError.js";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const isEmailExists = !!(await UserModel.findOne({ email }));
  if (isEmailExists) {
    throw new AppError("Email already exists", 409);
  }
  const newUser = await UserModel.create({ email, name, password });
  const token = jwt.sign(
    { userId: newUser._id, email, name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Email or password is wrong", 400);
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new AppError("Email or password is wrong", 400);
  }
  const token = jwt.sign(
    { userId: user._id, email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});
export const me = asyncHandler(async (req, res, next) => {
  res.json({
    data: {
      user: req.user,
    },
  });
});
