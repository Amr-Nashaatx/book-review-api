import { describe, test, expect, beforeAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { UserModel } from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";
import { BookModel } from "../../src/models/bookModel.js";
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

  describe("GET /api/books", () => {
    test("returns first page of books with pageInfo", async () => {
      await request(app)
        .post("/api/books")
        .set("Cookie", authCookie)
        .send(testBook);

      const res = await request(app).get("/api/books");

      expect(res.status).toBe(200);

      const { books, pageInfo } = res.body.data;

      expect(books).toHaveLength(1);
      expect(books[0]).toMatchObject(testBook);

      expect(pageInfo).toMatchObject({
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: expect.any(String),
        prevCursor: expect.any(String),
      });
    });

    test("paginates forward using after cursor", async () => {
      // insert 3 books
      const b1 = { ...testBook, title: "AAAAAAAAAAA" };
      const b2 = { ...testBook, title: "BBBBBBBBBB" };
      const b3 = { ...testBook, title: "CCCCCCCCCC" };
      await request(app).post("/api/books").set("Cookie", authCookie).send(b1);

      await request(app).post("/api/books").set("Cookie", authCookie).send(b2);

      await request(app).post("/api/books").set("Cookie", authCookie).send(b3);

      // request page 1 (first 2)
      let res = await request(app).get("/api/books?limit=2");
      expect(res.status).toBe(200);

      const { books, pageInfo } = res.body.data;

      expect(books).toHaveLength(2);

      const cursor = pageInfo.nextCursor;
      expect(cursor).toBeTruthy();

      // page 2 using after cursor
      res = await request(app).get(`/api/books?limit=2&after=${cursor}`);
      expect(res.status).toBe(200);

      const page2 = res.body.data.books;

      expect(page2).toHaveLength(1);
      expect(page2[0].title).toBe(b1.title); // last remaining book
    });

    test("paginates backward using before cursor", async () => {
      const b1 = { ...testBook, title: "AAAAAAAAAAA" };
      const b2 = { ...testBook, title: "BBBBBBBBBB" };
      const b3 = { ...testBook, title: "CCCCCCCCCC" };

      await request(app).post("/api/books").set("Cookie", authCookie).send(b1);

      await request(app).post("/api/books").set("Cookie", authCookie).send(b2);

      await request(app).post("/api/books").set("Cookie", authCookie).send(b3);
      // get page 2 cursor
      let res = await request(app).get("/api/books?limit=2");
      const cursor = res.body.data.pageInfo.nextCursor;

      // go forward to page 2
      res = await request(app).get(`/api/books?limit=2&after=${cursor}`);
      const beforeCursor = res.body.data.pageInfo.prevCursor;

      // go back to page 1 using before
      res = await request(app).get(`/api/books?limit=2&before=${beforeCursor}`);

      const { books, pageInfo } = res.body.data;

      expect(pageInfo.hasNextPage).toBe(true);
      expect(pageInfo.hasPrevPage).toBe(false);

      expect(books).toHaveLength(2);
    });

    test("filters by author prefix", async () => {
      const b1 = { ...testBook, author: "Brandon Sanderson" };
      const b2 = { ...testBook, author: "Bram Stoker" };
      const b3 = { ...testBook, author: "Tolstoy" };

      await request(app).post("/api/books").set("Cookie", authCookie).send(b1);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b2);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b3);

      const res = await request(app).get("/api/books?author=Br");

      const { books } = res.body.data;

      expect(books).toHaveLength(2);
      expect(books[0].author).toMatch(/Br/i);
      expect(books[1].author).toMatch(/Br/i);
    });

    test("filters by rating range", async () => {
      const b1 = { ...testBook, averageRating: 3 };
      const b2 = { ...testBook, averageRating: 4 };
      const b3 = { ...testBook, averageRating: 5 };

      await request(app).post("/api/books").set("Cookie", authCookie).send(b1);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b2);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b3);

      const res = await request(app).get("/api/books?rating[gte]=4");

      const ratings = res.body.data.books.map((b) => b.averageRating);
      expect(ratings).toEqual(expect.arrayContaining([4, 5]));
      expect(ratings).not.toContain(3);
    });

    test("filters by genre array", async () => {
      const b1 = { ...testBook, genre: "Fantasy" };
      const b2 = { ...testBook, genre: "Sci-Fi" };
      const b3 = { ...testBook, genre: "Horror" };

      await request(app).post("/api/books").set("Cookie", authCookie).send(b1);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b2);
      await request(app).post("/api/books").set("Cookie", authCookie).send(b3);

      const res = await request(app).get(
        "/api/books?genre[]=Fantasy&genre[]=Sci-Fi"
      );

      const genres = res.body.data.books.map((b) => b.genre);

      expect(genres).toEqual(expect.arrayContaining(["Fantasy", "Sci-Fi"]));
      expect(genres).not.toContain("Horror");
    });
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
