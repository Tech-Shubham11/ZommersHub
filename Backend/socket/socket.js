import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL || "*", // ✅ fallback added
    methods: ["GET", "POST"],
    credentials: true, // ✅ important for cookies
  },
});

// ✅ userId -> socketId
const userSocketMap = {};

// ✅ helper
export const getReceiverSocketId = (receiverId) =>
  userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("🔌 User Connected:", userId, socket.id);

  // ✅ store mapping
  if (userId) {
    userSocketMap[userId] = socket.id;

    // ✅ join personal room (important)
    socket.join(userId);
  }

  // ✅ send online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ disconnect
  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", userId);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };