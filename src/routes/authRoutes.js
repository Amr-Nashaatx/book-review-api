import express from "express";
import { login, register, logout } from "../controllers/authController.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/authValidators.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @group Auth - Operations about user authentication
 * @param {object} request.body.required - User registration details
 * @param {string} request.body.name.required - User's name (3-10 characters)
 * @param {string} request.body.email.required - User's email address
 * @param {string} request.body.password.required - User's password (strong password)
 * @returns {object} 201 - User registration success message
 * @returns {object} 400 - Validation error message
 * @returns {object} 500 - Internal server error message
 * @security JWT
 */

router.post("/register", validateRegisterUser, register);

/**
 * @route POST /api/auth/login
 * @group Auth - Operations about user authentication
 * @param {object} request.body.required - User login credentials
 * @param {string} request.body.email.required - User's email address
 * @param {string} request.body.password.required - User's password
 * @returns {object} 200 - Successful login response (returns user and token)
 * @returns {object} 400 - Authentication error (invalid credentials)
 * @returns {object} 500 - Internal server error
 */

router.post("/login", validateLoginUser, login);

/**
 * @route POST /api/auth/logout
 * @group Auth - Operations about user authentication
 * @returns {object} 200 - Successful logout response (returns user and token)
 * @returns {object} 500 - Internal server error
 */

router.post("/logout", logout);

export default router;
