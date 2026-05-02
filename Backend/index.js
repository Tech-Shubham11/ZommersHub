import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utility/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import dotenv from "dotenv";
import path from "path";
import "./utility/cloudinary.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ API ROUTES (ONLY API HERE)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


// ✅ SERVE FRONTEND
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// ✅ FINAL FALLBACK (IMPORTANT)
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// ✅ START SERVER
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

