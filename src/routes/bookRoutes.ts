import express, { Router, Request, Response, NextFunction } from "express";
import {
  createBookController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getBooksController,
  getGenresController,
  uploadBookCoverController,
  getMyBooksController,
} from "../controllers/bookController.js";
import {
  validateCreateBook,
  validateUpdateBook,
} from "../middlewares/bookValidators.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router: Router = express.Router();

router
  .route("/")
  .get(getBooksController)
  .post(auth, validateCreateBook, createBookController);

router.get("/my-books", auth, getMyBooksController);
router.get("/genres", getGenresController);

router
  .route("/:id")
  .get(getBookByIdController)
  .put(auth, validateUpdateBook, updateBookController)
  .delete(auth, deleteBookController);

router.post(
  "/:id/cover",
  auth,
  upload.single("cover"),
  uploadBookCoverController,
);

export default router;
