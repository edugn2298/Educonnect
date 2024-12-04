import Message from "../models/message.model.js";

/**
 * Function to send a message
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The created message
 * @method POST
 */
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

/**
 * get message
 * @function getMessage
 * @async - The function is asynchronous
 * @method GET
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The messages
 */
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

/**
 * get message by id
 * @function getMessageById
 * @async - The function is asynchronous
 * @method GET
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns - {Object} - The message
 */
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * delete message
 * @function deleteMessage
 * @async - The function is asynchronous
 * @method PATCH
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns - {Object} - The deleted message
 */
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
