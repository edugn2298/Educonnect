import Router from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const routerMessage = Router();
/**
 * Function to send a message
 * @method POST
 */
routerMessage.post("/", sendMessage);

/**
 * Function to get a message
 * @method GET
 */
routerMessage.get("/:chatId", getMessage);

export default routerMessage;
