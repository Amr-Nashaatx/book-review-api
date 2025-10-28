import express from "express";
import {
  createBookController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getBooksController,
} from "../controllers/bookController.js";
import {
  validateCreateBook,
  validateUpdateBook,
} from "../middlewares/bookValidators.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getBooksController)
  .post(auth, validateCreateBook, createBookController);

router
  .route("/:id")
  .get(getBookByIdController)
  .put(auth, validateUpdateBook, updateBookController)
  .delete(auth, deleteBookController);

export default router;
