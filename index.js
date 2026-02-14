import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import router from './routes/authRoutes.js';
import songRouter from './routes/songRoutes.js';

dotenv.config(".env");
const PORT = process.env.PORT || 5001;
const app = express();

// ✅ FIX: increase body size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use("/api/songs", songRouter);
app.use("/api/auth", router);

app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT} successfully`)
);
