import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors/AppError.js";

export const validateCreateBook = [
  body("title")
    .isString()
    .withMessage("title cannot be numbers")
    .notEmpty()
    .withMessage("title cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 to 30 characters long"),
  body("author")
    .isString()
    .withMessage("author cannot be numbers")
    .notEmpty()
    .withMessage("author cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("author must be between 3 to 30 characters long"),
  body("genre")
    .isString()
    .withMessage("genre cannot be numbers")
    .notEmpty()
    .withMessage("genre cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("genre must be between 3 to 30characters long"),
  body("publishedYear")
    .notEmpty()
    .withMessage("publishedYear must be provided")
    .isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
export const validateUpdateBook = [
  body("title")
    .isString()
    .withMessage("title cannot be numbers")
    .notEmpty()
    .optional()
    .withMessage("title cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 to 30 characters long"),
  body("author")
    .isString()
    .withMessage("author cannot be numbers")
    .notEmpty()
    .optional()
    .withMessage("author cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("author must be between 3 to 30 characters long"),
  body("genre")
    .isString()
    .optional()
    .withMessage("genre cannot be numbers")
    .notEmpty()
    .withMessage("genre cannot be empty")
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("genre must be between 3 to 30 characters long"),
  body("publishedYear")
    .notEmpty()
    .optional()
    .withMessage("publishedYear must be provided")
    .isNumeric(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed", 400, errors.array());
    }
    next();
  },
];
