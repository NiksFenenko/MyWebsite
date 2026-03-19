import express from "express";
import cors from "cors";
// Импортируй роуты аккуратно
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Сначала базовые настройки
app.use(cors({ origin: '*' })); // Временно разрешаем всё для теста
app.use(express.json());

// 2. Тестовый роут для проверки "живучести"
app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT, env: process.env.NODE_ENV });
});

// 3. Оборачиваем роуты, которые используют БД, в try-catch
try {
  app.use("/api/products", productRoutes);
  // Добавь остальные роуты сюда
} catch (error) {
  console.error("Ошибка при инициализации роутов:", error);
}

// 4. Запуск сервера в самом конце
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER IS UP: http://0.0.0.0:${PORT}`);
});