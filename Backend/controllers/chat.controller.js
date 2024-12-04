import Chat from "../models/chat.model.js";

/**
 * create chat
 * @async
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @method POST
 * @example http://localhost:3050/chats
 * @returns {Object} - The created chat
 */
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

/**
 * get all chats for user
 * @async
 * @requires - authenticate middleware
 * @method GET
 * @example http://localhost:3050/chats
 * @param {*} req - The request object
 * @param {*} res  - The response object
 */
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

/**
 * get chat by id
 * @async
 * @requires - authenticate middleware
 * @method GET
 * @example http://localhost:3050/chats/:id
 * @param {*} req - The request object
 * @param {*} res  - The response object
 */
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

/**
 * delete chat by id
 * @async
 * @requires - authenticate middleware
 * @method DELETE
 * @example http://localhost:3050/chats/:id
 * @param {*} req - The request object
 * @param {*} res  - The response object
 */
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
