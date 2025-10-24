import express from "express";
import { me } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/auth/me
 * @group Auth - Operations about user authentication
 * @returns {object} 200 - Authenticated user object
 * @returns {object} 401 - Unauthorized
 * @returns {object} 500 - Internal server error
 * @security JWT
 */
// GET /api/auth/me
router.get("/me", auth, me);

export default router;
