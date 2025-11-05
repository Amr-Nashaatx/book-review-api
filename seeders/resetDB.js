import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import mongoose from "mongoose";

dotenv.config();

const collections = mongoose.connection.collections;
for (const key in collections) {
  await collections[key].deleteMany();
}

await connectDB();
console.log(`✅ Deleted All data in DB`);
mongoose.connection.close();
