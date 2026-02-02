import express, { Router } from "express";
import {
  createShelfController,
  getShelvesController,
  getShelfByIdController,
  updateShelfController,
  deleteShelfController,
  addBookToShelfController,
  removeBookFromShelfController,
} from "../controllers/shelfController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router: Router = express.Router();

router.use(auth); // All shelf routes require authentication

router.route("/").get(getShelvesController).post(createShelfController);

router
  .route("/:id")
  .get(getShelfByIdController)
  .put(updateShelfController)
  .delete(deleteShelfController);

router.route("/:id/books").post(addBookToShelfController);

router.route("/:id/books/:bookId").delete(removeBookFromShelfController);

export default router;
