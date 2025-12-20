import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.NODE_ENV === "development"
          ? process.env.DEV_ACCESS_TOKEN_EXP
          : "10m",
    }
  );
};

export function signRefreshToken(userId, sessionId) {
  return jwt.sign({ userId, sessionId }, process.env.DEV_REFRESH_SECRET, {
    expiresIn:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_REFRESH_TOKEN_EXP
        : "30d",
  });
}
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 10 * 60 * 60 * 1000,
};
export const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 10 * 60 * 60 * 1000,
};
export const clearTokenCookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};
export const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
