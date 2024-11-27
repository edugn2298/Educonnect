import Chat from "../models/chat.model.js";

export const createChat = async (req, res) => {
  const chat = await Chat.create({
    users: [req.user._id, req.body.userId],
  });
  try {
    const result = await chat.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatsForUser = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: { $in: [req.user._id] },
      deleted: false,
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.firstId, req.secondId] },
    });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true }
    );
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
