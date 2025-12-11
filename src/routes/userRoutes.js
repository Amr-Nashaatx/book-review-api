import express from "express";
import { me } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /user/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: Retrieves the profile information of the currently authenticated user.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "64ff1ac2b72d3a10f7e3c9a4"
 *                   name: "johndoe"
 *                   email: "john@example.com"
 *                   role: "user"
 *               message: "user fetched successfully"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
router.get("/me", auth, me);

export default router;
