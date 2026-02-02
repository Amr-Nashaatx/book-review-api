import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export { connectDB };
