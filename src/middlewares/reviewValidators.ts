import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors/AppError.js";
import { Request, Response, NextFunction } from "express";

export const validateCreateReview = [
  body("rating").notEmpty().isNumeric(),
  body("comment").optional().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array() as any);
    }
    next();
  },
];

export const validateUpdateReview = [
  body("rating").notEmpty().isNumeric().optional(),
  body("comment").optional().isString().optional(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array() as any);
    }
    next();
  },
];
