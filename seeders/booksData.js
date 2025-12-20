import { faker } from "@faker-js/faker";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GOOGLE_BOOKS_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const AVERAGE_RATING = () => 1 + Math.floor(Math.random() * 5);

const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "History",
  "Biography",
  "Philosophy",
  "Adventure",
  "Self Help",
];

async function fetchBooksByGenre(genre, total = 80) {
  const books = [];
  const maxResults = 40;

  for (let startIndex = 0; startIndex < total; startIndex += maxResults) {
    const url = new URL(BASE_URL);
    url.searchParams.set("q", `subject:${genre}`);
    url.searchParams.set("langRestrict", "en");
    url.searchParams.set("printType", "books");
    url.searchParams.set("maxResults", maxResults);
    url.searchParams.set("startIndex", startIndex);
    url.searchParams.set("key", API_KEY);

    let result = [];
    try {
      result = await axios.get(url);
    } catch (error) {
      console.warn(`⚠️ Failed to fetch ${genre} books at index ${startIndex}`);
    }
    if (result.data?.items) {
      const batch =
        result.data.items?.map(({ volumeInfo: b }) => ({
          _id: faker.database.mongodbObjectId(),
          title: b.title ? b.title.trim() : "Untitled",
          author: b.authors?.[0] || "Unknown",
          description: b.description || "No description available.",
          genre,
          averageRating: AVERAGE_RATING(),
          publishedYear: parseInt(b.publishedDate) || new Date().getFullYear(),
          coverImage: b.imageLinks?.thumbnail || null,
        })) || [];

      books.push(...batch);
      console.log(
        `📚 [${genre}] +${batch.length} books (total ${books.length})`
      );
    }
  }

  return books;
}
export async function fetchBooks(maxCountPerGenre = 80) {
  let allBooks = [];
  for (const genre of GENRES) {
    const books = await fetchBooksByGenre(genre, maxCountPerGenre);
    allBooks.push(...books);
  }

  // 🔸 Deduplicate by title + author
  const uniqueBooks = [];
  const seen = new Set();

  for (const book of allBooks) {
    const key = `${book.title}-${book.author}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueBooks.push(book);
    }
  }
  console.log(`✅ Total unique books: ${uniqueBooks.length}`);

  return uniqueBooks;
}
