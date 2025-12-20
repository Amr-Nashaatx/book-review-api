import { asyncHandler } from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  loginUser,
  refresh,
  registerUser,
  revokeSession,
} from "../services/authService.js";
import { AppError } from "../utils/errors/AppError.js";
import { APIResponse } from "../utils/response.js";
import {
  clearTokenCookieOptions,
  refreshTokenCookieOptions,
  serializeUser,
  tokenCookieOptions,
} from "../utils/utils.js";

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const {
    token,
    user: newUser,
    refreshToken,
  } = await registerUser(name, email, password);

  res.cookie("jwt_token", token, tokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  const response = new APIResponse("success", "User registered successfully");
  response.addResponseData("user", serializeUser(newUser));
  res.status(201).json(response);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { token, user, refreshToken } = await loginUser(email, password);

  res.cookie("jwt_token", token, tokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  const response = new APIResponse("success", "User logged in successfully");
  response.addResponseData("user", serializeUser(user));

  res.status(200).json(response);
});

export const refreshTokenController = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) throw new AppError("refresh requried", 401);

  const { newAccessToken, newRefreshToken } = await refresh(refreshToken);

  res.cookie("jwt_token", newAccessToken, tokenCookieOptions);
  res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions);
  res.send();
});

export const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    const { sessionId } = jwt.verify(
      refreshToken,
      process.env.DEV_REFRESH_SECRET
    );
    await revokeSession(sessionId);
  }
  res.clearCookie("jwt_token", clearTokenCookieOptions);
  res.clearCookie("refresh_token", clearTokenCookieOptions);
  const response = new APIResponse("success", "Logged out successfully");
  res.status(200).json(response);
});
