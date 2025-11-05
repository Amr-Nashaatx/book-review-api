import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/userModel.js";
const router = express.Router();
import dotenv from "dotenv";

dotenv.config();
const { NODE_ENV, ENABLE_DEV_AUTH, DEV_AUTH_SECRET, JWT_SECRET } = process.env;

const isDevAllowed =
  NODE_ENV !== "production" && ENABLE_DEV_AUTH === "true" && DEV_AUTH_SECRET;

if (!isDevAllowed) {
  router.use((req, res) => res.status(404).send("Not Found"));
} else {
  console.warn(
    "[DevAuth] ⚠️ Dev login route enabled — DO NOT DEPLOY TO PRODUCTION."
  );
  const localOnly = (req, res, next) => {
    const allowed = ["127.0.0.1", "1"];
    const ip = req.ip || req.connection.remoteAddress;
    if (!allowed.includes(ip.replace(/^.*:/, ""))) {
      return res.status(403).send("Dev route restricted to localhost");
    }
    next();
  };

  // POST /dev/login-any
  router.post("/login-any", localOnly, async (req, res) => {
    try {
      const { email } = req.body;
      let user = await UserModel.findOne({ email });

      // Generate JWT (short-lived)
      const token = jwt.sign(
        { sub: user._id.toString(), role: user.role, dev: true },
        JWT_SECRET || DEV_AUTH_SECRET,
        { expiresIn: "15m" }
      );
      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      });
      res.json({
        user: { id: user._id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Dev login error:", err);
      res.status(500).send("Dev login failed");
    }
  });
}

export default router;
