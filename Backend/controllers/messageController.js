import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // Create conversation if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: []   // ✅ make sure field name is messages
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    // ✅ FIXED field name
    conversation.messages.push(newMessage._id);

    await Promise.all([
      conversation.save(),
      newMessage.save()
    ]);

    // 🔥 Socket Real-Time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []   // ✅ consistent
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages  // ✅ FIXED KEY
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

