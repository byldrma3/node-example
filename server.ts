import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import postRoutes from "./routes/postRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRotes";

// Konfigürasyon dosyasını yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısı
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Bir şeyler yanlış gitti!");
});
app.use(cors());

// Rotalar
app.use("/posts", postRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} portunda başlatıldı.`);
});

export default app;
