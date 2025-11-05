import { connectDB } from "../src/config/db.js";
import { UserModel } from "../src/models/userModel.js";
import { ReviewModel } from "../src/models/reviewModel.js";
import { BookModel } from "../src/models/bookModel.js";

import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
try {
  await connectDB();
  const books = await BookModel.find({});
  let nonExistentUsersCount = 0;
  for (let book of books) {
    const userExists = await UserModel.exists({
      _id: new mongoose.Types.ObjectId(book.createdBy),
    });
    if (!userExists) {
      console.log(`❌ user ${book.createdBy} does not exist`);
      nonExistentUsersCount++;
    }
  }
  console.log(
    `✅ Found ${nonExistentUsersCount} non-existent users references on books!`
  );

  const reviews = await ReviewModel.find({});
  let nonValidUsersOnReviews = 0;
  let nonValidBooksOnReviews = 0;
  for (let review of reviews) {
    const bookExists = await BookModel.exists({ _id: review.book });
    const userExists = await UserModel.exists({ _id: review.user });
    if (!bookExists) {
      nonValidBooksOnReviews++;
      console.log(`❌ book ${review.book} does not exist`);
    }
    if (!userExists) {
      nonValidUsersOnReviews++;
      console.log(`❌ user ${review.user} does not exist`);
    }
  }
  console.log(
    `✅ Found ${nonValidUsersOnReviews} non-existent users references on reviews and ${nonValidBooksOnReviews} non-existent books on reviews!`
  );
  mongoose.disconnect();
} catch (error) {
  console.log("❌ something went wrong!");
  console.error(error);
}
