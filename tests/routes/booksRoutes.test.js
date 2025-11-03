import { describe, test, expect, beforeAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { UserModel } from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";

let authCookie;
let testBook;

beforeAll(async () => {
  const user = await UserModel.create({
    name: "Amr",
    email: "test@test.com",
    password: "pass1234",
  });

  testBook = {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    description: "A story about three hobbits",
    publishedYear: 1937,
  };

  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  authCookie = `jwt_token=${token}`;
});

describe("Book Routes ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("POST /api/books should create a book (auth required)", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Cookie", authCookie)
      .send(testBook);

    expect(res.status).toBe(201);
    expect(res.body.data.book).toMatchObject(testBook);
  });

  test("GET /api/books should return all books", async () => {
    await request(app)
      .post("/api/books")
      .set("Cookie", authCookie)
      .send(testBook);

    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body.data.books).toHaveLength(1);
    expect(res.body.data.books[0]).toMatchObject(testBook);
  });

  test("GET /api/books/:id returns one book", async () => {
    const createRes = await request(app)
      .post("/api/books")
      .set("Cookie", authCookie)
      .send(testBook);

    const id = createRes.body.data.book._id;

    const res = await request(app).get(`/api/books/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.book).toMatchObject(testBook);
  });

  test("PUT /api/books/:id updates a book", async () => {
    const createRes = await request(app)
      .post("/api/books")
      .set("Cookie", authCookie)
      .send({ ...testBook });

    const id = createRes.body.data.book._id;

    const res = await request(app)
      .put(`/api/books/${id}`)
      .set("Cookie", authCookie)
      .send({ title: "New Title" });

    expect(res.status).toBe(200);
    expect(res.body.data.book).toMatchObject({
      ...testBook,
      title: "New Title",
    });
  });

  test("DELETE /api/books/:id removes a book", async () => {
    const createRes = await request(app)
      .post("/api/books")
      .set("Cookie", authCookie)
      .send(testBook);

    const id = createRes.body.data.book._id;

    const res = await request(app)
      .delete(`/api/books/${id}`)
      .set("Cookie", authCookie);

    expect(res.status).toBe(200);
  });
});
