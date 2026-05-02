import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

// ✅ Send message
router.post("/send/:id", isAuthenticated, sendMessage);

// ✅ Get all messages (MUST be GET)
router.get("/all/:id", isAuthenticated, getMessage);

export default router;
