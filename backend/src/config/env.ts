import dotenv from "dotenv";

// На сервере dotenv.config() не обязателен, 
// но для локальной разработки оставим его в простом виде
dotenv.config(); 

export const ENV = {
    // Используем process.env напрямую. 
    // Если переменной нет в системе, возьмет значение по умолчанию.
    PORT: process.env.PORT || "3000",
    DATABASE_URL: process.env.DATABASE_URL || "",
    NODE_ENV: process.env.NODE_ENV || "development",

    FRONTEND_URL: process.env.FRONTEND_URL || "https://my-website-beta-seven-68.vercel.app",
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
};