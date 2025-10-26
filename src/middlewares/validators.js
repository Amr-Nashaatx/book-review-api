import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors/AppError.js";

export const validateRegisterUser = [
  body("name")
    .isString()
    .withMessage("Name cannot be numbers")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 10 })
    .withMessage("Name must be between 3 to 10 characters long"),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email must be provided"),
  body("password")
    .notEmpty()
    .withMessage("Password must be provided")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 - 20 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];

export const validateLoginUser = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email must be provided"),
  body("password")
    .notEmpty()
    .withMessage("Password must be provided")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 - 20 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
