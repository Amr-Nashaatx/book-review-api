import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsOfBook,
  isBookReviewed,
  updateReview,
} from "../services/reviewService.js";
import { AppError } from "../utils/errors/AppError.js";
import { APIResponse } from "../utils/response.js";

export const getReviewsController = asyncHandler(async (req, res, next) => {
  const bookId = req.params.bookId;
  const { after, before, limit, sort = "-_id" } = req.query;
  const paginationParameters = { after, before, limit, sort };
  const { reviews, pageInfo } = await getReviewsOfBook(
    bookId,
    paginationParameters
  );
  const response = new APIResponse("success", "Reviews fetched successfully");
  response.addResponseData("reviews", reviews);
  response.addResponseData("pageInfo", pageInfo);

  res.json(response);
});

export const createReviewController = asyncHandler(async (req, res, next) => {
  const bookId = req.params.bookId;
  const currUserId = req.user._id.toString();
  const review = req.body;

  const isReviewed = await isBookReviewed(currUserId, bookId);

  if (isReviewed) throw new AppError("Book is already reviewed", 400);
  const createdReview = await createReview({
    ...review,
    user: currUserId,
    book: bookId,
  });

  const response = new APIResponse("success", "review created!");
  response.addResponseData("review", createdReview);
  res.status(201).json(response);
});

export const updateReviewController = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const reviewUpdates = req.body;
  const review = await getReviewById(reviewId);

  if (!(review.user.toString() === req.user._id.toString()))
    throw new AppError("User does not own review", 400);

  const updatedReview = await updateReview(reviewId, reviewUpdates);

  const response = new APIResponse("success", "Review updated!");
  response.addResponseData("review", updatedReview);
  res.json(response);
});

export const deleteReviewController = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await getReviewById(reviewId);
  // check ownership of review
  if (!(review.user.toString() === req.user._id.toString()))
    throw new AppError("User does not own review", 400);

  await deleteReview(reviewId);
  res.json(new APIResponse("success", "Review deleted!"));
});
