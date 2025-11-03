import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors/AppError.js";

export const validateCreateReview = [
  body("rating").notEmpty().isNumeric(),
  body("comment").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
export const validateUpdateReview = [
  body("rating").notEmpty().isNumeric().optional(),
  body("comment").optional().isString().optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
