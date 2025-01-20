import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatSchema.plugin(mongoosePaginate);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
