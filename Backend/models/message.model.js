import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Schema of message
 * @type {Schema}
 * @category Models
 * @module Message
 * @requires mongoose
 * @requires mongoose.Schema
 * @property {string} sender - The sender of the message.
 * @property {string} receiver - The receiver of the message.
 * @property {string} content - The content of the message.
 * @property {string} createdAt - The created at of the message.
 * @property {string} read - The read status of the message.
 */
const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Plugin for pagination
 */
messageSchema.plugin(mongoosePaginate);

const Message = mongoose.model("Message", messageSchema);

export default Message;
