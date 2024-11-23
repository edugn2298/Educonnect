import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Schema of post
 * @type {Schema}
 * @category Models
 * @module Post
 * @requires mongoose
 * @requires mongoosePaginate
 * @requires mongoose.Schema
 * @property {string} author - The author of the post.
 * @property {string} content - The content of the post.
 * @property {string} media - The media of the post.
 * @property {string} likes - The likes of the post.
 * @property {string} comments - The comments of the post.
 * @property {string} hashtags - The hashtags of the post.
 * @property {string} createdAt - The created at of the post.
 * @property {string} updatedAt - The updated at of the post.
 */

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  media: [
    {
      type: String,
      default: "",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  hashtags: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugin for pagination
 */
postSchema.plugin(mongoosePaginate);

/**
 * Model of post
 * @typedef {Object} postModel
 * @category Models
 */
const Post = mongoose.model("Post", postSchema);
export default Post;
