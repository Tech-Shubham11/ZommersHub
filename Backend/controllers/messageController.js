import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;

    // ✅ validation
    if (!textMessage || textMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // ✅ find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // ✅ create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: textMessage,
    });

    // ✅ push message
    conversation.messages.push(newMessage._id);

    await conversation.save();

    // 🔥 REAL-TIME (BEST WAY: ROOM BASED)
    io.to(receiverId).emit("newMessage", newMessage);
    io.to(senderId).emit("newMessage", newMessage); // ✅ VERY IMPORTANT

    return res.status(201).json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });

  } catch (error) {
    console.log("GET MESSAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};