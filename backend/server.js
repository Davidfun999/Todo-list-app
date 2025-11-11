// backend/server.js
import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";

dotenv.config(); // ⬅️ load env trước

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// CORS (bật nếu frontend ở domain khác)
// ví dụ đặt CLIENT_URL=https://your-frontend.example
if (process.env.CLIENT_URL) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
} else {
  // hoặc tạm thời mở tất cả trong giai đoạn dev
  app.use(cors());
}

// API routes
app.use("/api/todos", todoRoutes);

// Serve frontend build khi production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// healthcheck (hữu ích cho Render)
app.get("/api/health", (_req, res) => res.send("ok"));

// 🔌 Kết nối DB rồi mới start server
const start = async () => {
  await connectDB(); // sẽ exit(1) nếu lỗi
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
start();
