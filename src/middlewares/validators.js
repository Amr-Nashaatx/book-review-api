import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors/AppError.js";

export const validateRegisterUser = [
  body("name")
    .isString()
    .notEmpty()
    .toLowerCase()
    .isLength({ min: 3, max: 10 }),
  body("email").isEmail().notEmpty(),
  body("password").notEmpty().isLength({ min: 8, max: 20 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];

export const validateLoginUser = [
  body("email").isEmail().notEmpty(),
  body("password").notEmpty().isLength({ min: 8, max: 20 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
