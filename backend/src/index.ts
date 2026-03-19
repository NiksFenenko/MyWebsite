import express from "express";
import cors from "cors";

import {ENV} from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

if (!ENV.FRONTEND_URL) {
  console.warn("FRONTEND_URL not set. CORS may not work correctly.");
}
app.use(cors({
  origin: 'https://my-website-beta-seven-88.vercel.app', // Твой адрес фронтенда
  credentials: true
}));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
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

app.listen(ENV.PORT, () => console.log("server is up and running on PORT:", ENV.PORT));