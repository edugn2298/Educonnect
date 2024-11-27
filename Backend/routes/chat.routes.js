import Router from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createChat,
  getChatsForUser,
  findChat,
  deleteChat,
} from "../controllers/chat.controller.js";

const routerChat = Router();
/*
routerChat.post("/", authenticate, authorize(["user", "admin"]), createChat);
routerChat.get("/", authenticate, authorize(["user", "admin"]), getChatsForUser);
routerChat.get("/:id", authenticate, authorize(["user", "admin"]), getChatById);
routerChat.delete("/:id", authenticate, authorize(["admin"]), deleteChat);
*/

routerChat.post("/", createChat);
routerChat.get("/:userId", getChatsForUser);
routerChat.get("/find/:firstId/:secondId", findChat);
routerChat.delete("/:id", deleteChat);

export default routerChat;
