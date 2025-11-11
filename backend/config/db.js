// backend/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri || !uri.startsWith("mongodb")) {
    console.error("❌ MONGO_URI is missing or invalid:", uri);
    process.exit(1);
  }

  try {
    // Optional: tránh cảnh báo query cũ
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// graceful shutdown (tốt khi chạy trên Render/Heroku)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB disconnected");
  process.exit(0);
});

export default connectDB;
