import express from "express";
import { me } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /user/me:
 *   get:
 *     summary: Get the authenticated user's info
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's profile
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
 *                   example:
 *                     status: success
 *                     data:
 *                       user:
 *                         _id: 64ff1ac2b72d3a10f7e3c9a4
 *                         name: Amr Nashaat
 *                         email: amr@example.com
 *                         role: user
 *                     message: user fetched successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */

router.get("/me", auth, me);

export default router;
