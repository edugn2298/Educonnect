import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

/**
 * Function to send a message
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The created message
 * @method POST
 */
export const sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;
  const message = new Message({
    chat: chatId,
    sender: senderId,
    content: content,
  });
  console.log(message);
  try {
    const result = await message.save();
    res.status(201).json(result);
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
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  console.log(req.params.id);
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
