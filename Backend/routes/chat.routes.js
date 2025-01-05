import Router from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createChat,
  getChatsForUser,
  findChat,
  deleteChat,
} from "../controllers/chat.controller.js";

/**
 * Chat routes
 */
const routerChat = Router();

/**
 * @method POST
 * @description Create a new chat
 */
routerChat.post("/", authenticate, authorize(["user", "admin"]), createChat);

/**
 * @method GET
 * @description Get chat by id
 */

routerChat.get(
  "/find/:firstId/:secondId",
  authenticate,
  authorize(["user", "admin"]),
  findChat
);

/**
 * @method GET
 * @description Get chat by id for user
 */
routerChat.get(
  "/getchat/:userId/",
  authenticate,
  authorize(["user", "admin"]),
  getChatsForUser
);

/**
 * @method PATCH
 * @description Delete chat by id
 */
routerChat.patch(
  "/delete/:id",
  authenticate,
  authorize(["user", "admin"]),
  deleteChat
);

export default routerChat;
