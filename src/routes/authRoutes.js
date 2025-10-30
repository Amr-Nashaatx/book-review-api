import express from "express";
import { login, register, logout } from "../controllers/authController.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/authValidators.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           description: Response payload (varies per endpoint)
 *         message:
 *           type: string
 *           example: Operation completed successfully
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterUser"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Validation or email conflict error
 *       500:
 *         description: Internal server error
 */
router.post("/register", validateRegisterUser, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginUser"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Invalid credentials or bad request
 *       500:
 *         description: Internal server error
 */
router.post("/login", validateLoginUser, login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

export default router;

/**
    * @openapi
    * components:

    *   schemas:

    *     RegisterUser:

    *       type: object

    *       required:

    *         - name

    *         - email

    *         - password

    *       properties:

    *         name:

    *           type: string

    *           example: "testuser"

    *         email:

    *           type: string

    *           example: test@testing.com

    *         password:

    *           type: string

    *           example: testuser

    * 

    *     LoginUser:

    *       type: object

    *       required:

    *         - email

    *         - password

    *       properties:

    *         email:

    *           type: string

    *           example: test@testing.com

    *         password:

    *           type: string

    *           example: testuser

    * 

    *     AuthResponse:

    *       type: object

    *       properties:

    *         status:

    *           type: string

    *           example: success

    *         data:

    *           type: object

    *           properties:

    *             user:

    *               $ref: "#/components/schemas/User"

    *             message:

    *               type: string

    *               example: user logged in/ registered successfully
 */
