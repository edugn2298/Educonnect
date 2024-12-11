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
routerChat.get("/:id", authenticate, authorize(["user", "admin"]), findChat);

/**
 * @method PATCH
 * @description Delete chat by id
 */
routerChat.patch("/:id", authenticate, authorize(["admin"]), deleteChat);

/**
 * @method GET
 * @description Get chat by id for user
 */
routerChat.get(
  "/user/:userId",
  authenticate,
  authorize(["user", "admin"]),
  getChatsForUser
);

export default routerChat;
