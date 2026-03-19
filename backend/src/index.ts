import express from "express";
import cors from 'cors';
import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

// 1. Настройки (Middlewares) — ДОЛЖНЫ БЫТЬ ПЕРВЫМИ
app.use(cors({
  origin: 'https://my-website-beta-seven-88.vercel.app',
  credentials: true
}));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Роуты
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Productify API",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

// 3. Запуск сервера — ТОЛЬКО ОДИН РАЗ И В САМОМ КОНЦЕ
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});