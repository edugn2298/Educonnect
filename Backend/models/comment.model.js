import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Schema of comment
 * @type {Schema}
 * @category Models
 * @module Comment
 * @requires mongoose
 * @requires mongoose.Schema
 * @property {string} post - The post of the comment.
 * @property {string} author - The author of the comment.
 * @property {string} content - The content of the comment.
 * @property {string} createdAt - The created at of the comment.
 * @property {string} updatedAt - The updated at of the comment.
 */
const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
