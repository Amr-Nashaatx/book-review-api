import { asyncHandler } from "../middlewares/asyncHandler.js";
import { loginUser, registerUser } from "../services/authService.js";
import { APIResponse } from "../utils/response.js";

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const { token, user: newUser } = await registerUser(name, email, password);
  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });
  const response = new APIResponse("success", "User registered successfully");
  response.addResponseData("user", {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });
  res.status(201).json(response);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser(email, password);
  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  const response = new APIResponse("success", "User logged in successfully");
  response.addResponseData("user", {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
  res.status(200).json(response);
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt_token", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  const response = new APIResponse("success", "Logged out successfully");
  res.status(200).json(response);
});
