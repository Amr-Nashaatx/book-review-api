import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { AppError } from "../utils/errors/AppError.js";
import { generateToken, sanitizeUser } from "../utils/utils.js";

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
  const token = generateToken(newUser);

  return { user: sanitizeUser(newUser), token };
};

/**
 * Authenticates a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string }}
 */
export const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new AppError("Email or password is wrong", 400);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Email or password is wrong", 400);

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};
