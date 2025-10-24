import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export { connectDB };
