import express, { Router, Request, Response, NextFunction } from "express";
import {
  login,
  register,
  logout,
  refreshTokenController,
} from "../controllers/authController.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/authValidators.js";

const router: Router = express.Router();

router.post("/register", validateRegisterUser, register);
router.post("/refresh", refreshTokenController);
router.post("/login", validateLoginUser, login);

router.post("/logout", logout);

export default router;
