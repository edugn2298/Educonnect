import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, receiverId, content } = req.body;
    const message = new Message({
      chat: chatId,
      sender: senderId,
      receiver: receiverId,
      content,
      read: false,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessage = async (req, res) => {
  const { chatId, page = 1, limit = 10 } = req.query;
  const messages = await Message.paginate(
    { chat: chatId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
    }
  );
  res.status(200).json(messages);
};
