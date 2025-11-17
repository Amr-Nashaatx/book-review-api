import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const allCollections = await mongoose.connection.db.listCollections().toArray();

for (const { name } of allCollections) {
  await mongoose.connection.db.collection(name).deleteMany({});
}

console.log(`✅ Deleted All data in DB`);
mongoose.connection.close();
