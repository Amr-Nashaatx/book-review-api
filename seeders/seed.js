import { createFakeReviews } from "./fakeReviews.js";
import { fetchBooks } from "./booksData.js";
import { createFakeUsers } from "./fakeUsers.js";
import { connectDB } from "../src/config/db.js";
import { UserModel } from "../src/models/userModel.js";
import { ReviewModel } from "../src/models/reviewModel.js";
import { BookModel } from "../src/models/bookModel.js";
import mongoose from "mongoose";

const REVIEWS_PER_BOOK = () => 10 + Math.floor(Math.random() * 41);
function assignUsersToBooks(users, books) {
  for (let book of books) {
    book.createdBy = users[Math.floor(Math.random() * users.length)]._id;
  }
  return books;
}

// return bunch of reviews on attached to a bookID
function generateReviewsForBook(bookId) {
  const reviews = createFakeReviews(REVIEWS_PER_BOOK());

  for (let review of reviews) {
    review.book = bookId;
  }

  return reviews;
}
function* randomUserGenerator(users) {
  const pool = [...users];
  while (pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    yield pool.splice(randomIndex, 1)[0];
  }
}

function createReviewsForBooks(users, books) {
  // create a bunch of reviews for each book
  let totalReviews = [];
  for (let book of books) {
    const currBookReviewers = new Set();
    const generatedReviews = generateReviewsForBook(book._id);
    let i = 0;
    while (i < generatedReviews.length) {
      const getUser = randomUserGenerator(users);
      let nextUser = getUser.next();
      if (!currBookReviewers.has(nextUser.value)) {
        generatedReviews[i].user = nextUser.value._id;
        currBookReviewers.add(nextUser.value);
        i++;
      }
    }
    totalReviews.push(...generatedReviews);
  }
  return totalReviews;
}

const users = createFakeUsers(100);
const books = await fetchBooks();
const ownedBooks = assignUsersToBooks(users, books);
const reviews = createReviewsForBooks(users, ownedBooks);

try {
  await connectDB();
  await UserModel.create(users);
  await BookModel.create(ownedBooks);
  await ReviewModel.create(reviews);
  await mongoose.disconnect();
} catch (error) {
  console.log("❌ something went wrong!");
  console.error(error);
}
