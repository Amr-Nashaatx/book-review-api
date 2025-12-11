import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { UserModel } from "../src/models/userModel.js";
import { ShelfModel } from "../src/models/shelfModel.js";
import { BookModel } from "../src/models/bookModel.js";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_SHELVES = [
  {
    name: "Want to Read",
    description: "Books I plan to read",
    minBooks: 5,
    maxBooks: 15,
  },
  {
    name: "Currently Reading",
    description: "Books I am reading now",
    minBooks: 1,
    maxBooks: 5,
  },
  {
    name: "Read",
    description: "Books I have finished",
    minBooks: 10,
    maxBooks: 30,
  },
];

// Helper function to get random items from an array
const getRandomItems = (array, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

const seedShelves = async () => {
  try {
    await connectDB();
    console.log("Connected to DB...");

    const users = await UserModel.find({});
    console.log(`Found ${users.length} users.`);

    const allBooks = await BookModel.find({});
    console.log(`Found ${allBooks.length} books.`);

    if (allBooks.length === 0) {
      console.log("No books found in database. Please seed books first.");
      await mongoose.disconnect();
      process.exit(0);
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const user of users) {
      for (const shelfTemplate of DEFAULT_SHELVES) {
        let shelf = await ShelfModel.findOne({
          user: user._id,
          name: shelfTemplate.name,
        });

        const randomBooks = getRandomItems(
          allBooks,
          shelfTemplate.minBooks,
          shelfTemplate.maxBooks
        );
        const bookIds = randomBooks.map((book) => book._id);

        if (!shelf) {
          await ShelfModel.create({
            user: user._id,
            name: shelfTemplate.name,
            description: shelfTemplate.description,
            books: bookIds,
          });
          createdCount++;
        } else {
          // Update existing shelf with books if it doesn't have any
          if (shelf.books.length === 0) {
            shelf.books = bookIds;
            await shelf.save();
            updatedCount++;
          }
        }
      }
    }

    console.log(`Successfully created ${createdCount} new shelves.`);
    console.log(
      `Successfully updated ${updatedCount} existing shelves with books.`
    );

    await mongoose.disconnect();
    console.log("Disconnected from DB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding shelves:", error);
    process.exit(1);
  }
};

seedShelves();
