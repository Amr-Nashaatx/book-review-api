import express, { Router } from "express";
import { me } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router: Router = express.Router();

router.get("/me", auth, me);

export default router;
