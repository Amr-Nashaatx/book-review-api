import { describe, test, expect, beforeAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { UserModel } from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { BookModel } from "../../src/models/bookModel.js";

let authCookie;
let testUserId, testBookId, testReviewId, testReview, testBook;

beforeAll(async () => {
  testUserId = new mongoose.Types.ObjectId().toString();
  testBookId = new mongoose.Types.ObjectId().toString();
  testReviewId = new mongoose.Types.ObjectId().toString();

  const user = await UserModel.create({
    _id: testUserId,
    name: "test",
    email: "test@test.com",
    password: "pass1234",
  });

  testBook = {
    _id: testBookId,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    description: "A story about three hobbits",
    createdBy: testUserId,
    publishedYear: 1937,
  };
  testReview = {
    _id: testReviewId,
    user: testUserId,
    book: testBookId,
    rating: 3.5,
    comment: "this is so med",
  };

  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  authCookie = `jwt_token=${token}`;
});

describe("Review Routes ", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await BookModel.create(testBook);
  });

  describe("POST /api/reviews/book/:bookId/reviews", () => {
    test("creates a review (auth required)", async () => {
      const res = await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      expect(res.status).toBe(201);
      expect(res.body.status).toMatch("success");
      expect(res.body.data.review).toMatchObject(testReview);
    });

    test("returns error if as user already reviewed the book", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      const res = await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send({
          user: testUserId,
          book: testBookId,
          rating: 3.5,
          comment: "this is so med",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toMatch("fail");
    });
  });
  describe("GET /api/reviews/book/:bookId/reviews", () => {
    test("fetches all reviews associated with a book", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      const res = await request(app)
        .get(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch("success");
      expect(res.body.data.reviews[0]).toMatchObject(testReview);
    });
  });
  describe("PUT /api/reviews/:id", () => {
    test("updates a review by its id and returns the updated document", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      const res = await request(app)
        .put(`/api/reviews/${testReviewId}`)
        .set("Cookie", authCookie)
        .send({ comment: "updated comment" });

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch("success");
      expect(res.body.data.review).toMatchObject({
        ...testReview,
        comment: "updated comment",
      });
    });

    test("throws error if user does not own review", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      // create another user
      const user2Id = new mongoose.Types.ObjectId();
      const user2 = await UserModel.create({
        _id: user2Id,
        name: "user2",
        email: "test2@test.com",
        password: "pass1234",
      });
      const token2 = jwt.sign(
        { userId: user2Id, email: user2.email, name: user2.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const authCookie2 = `jwt_token=${token2}`;
      // update review of user1 as user2 should fail
      const res = await request(app)
        .put(`/api/reviews/${testReviewId}`)
        .set("Cookie", authCookie2)
        .send({ comment: "updated comment" });

      expect(res.status).toBe(400);
      expect(res.body.status).toMatch("fail");
      expect(res.body.message).toMatch("User does not own review");
    });
  });
  describe("DELETE /api/reviews/:id", () => {
    test("deletes a review by its id", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      const res = await request(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set("Cookie", authCookie);

      expect(res.status).toBe(200);
      expect(res.body.status).toMatch("success");
      expect(res.body.message).toMatch("Review deleted!");
    });
    test("throws error if user does not own review", async () => {
      await request(app)
        .post(`/api/reviews/book/${testBookId}/reviews`)
        .set("Cookie", authCookie)
        .send(testReview);

      // delete user2 from previous test
      await UserModel.deleteOne({ email: "test2@test.com" });
      // create another user
      const user2Id = new mongoose.Types.ObjectId();
      const user2 = await UserModel.create({
        _id: user2Id,
        name: "user2",
        email: "test2@test.com",
        password: "pass1234",
      });
      const token2 = jwt.sign(
        { userId: user2Id, email: user2.email, name: user2.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const authCookie2 = `jwt_token=${token2}`;
      // delete review of user1 as user2 should fail

      const res = await request(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set("Cookie", authCookie2);

      expect(res.status).toBe(400);
      expect(res.body.status).toMatch("fail");
      expect(res.body.message).toMatch("User does not own review");
    });
  });
});
