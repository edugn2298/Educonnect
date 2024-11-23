const mongoose = require("mongoose");

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
const commentSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
