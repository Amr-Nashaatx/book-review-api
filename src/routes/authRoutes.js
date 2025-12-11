import express from "express";
import { login, register, logout } from "../controllers/authController.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/authValidators.js";

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a new user account with the provided credentials. Email must be unique.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterUser"
 *           example:
 *             name: "johndoe"
 *             email: "john@example.com"
 *             password: "securePass123"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   name: "johndoe"
 *                   email: "john@example.com"
 *                   role: "user"
 *               message: "User registered successfully"
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
router.post("/register", validateRegisterUser, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and obtain session
 *     description: Authenticates user with email and password. Returns JWT token in httpOnly cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginUser"
 *           example:
 *             email: "john@example.com"
 *             password: "securePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "jwt_token=abcd1234; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   name: "johndoe"
 *                   email: "john@example.com"
 *                   role: "user"
 *               message: "User logged in successfully"
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
router.post("/login", validateLoginUser, login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out current user
 *     description: Clears the JWT token cookie and ends the user session.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *             example:
 *               status: success
 *               message: "User logged out successfully"
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

export default router;
