import Router from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const routerMessage = Router();

routerMessage.post("/", sendMessage);
routerMessage.get("/:chatId", getMessage);

export default routerMessage;
