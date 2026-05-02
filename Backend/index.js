import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utility/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import "./utility/cloudinary.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
  })
);

const __dirname = path.resolve();

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am coming from backend",
    success: true,
  });
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")));


app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Connect DB then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

