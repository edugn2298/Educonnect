import { get } from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

/**
 * Create comment
 * @async
 * @param {*} req contains postId and content
 * @param {*} res contains comment
 * @returns   message
 * @method POST
 * @example http://localhost:3050/comments
 */
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    const user = await User.findById(req.user._id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const comment = await Comment.create({
      content,
      author: user._id,
      post: post._id,
    });
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete comment
 * @param {*} req Contains commentId
 * @param {*} res Contains message
 * @returns Message
 * @method PATCH
 * @example http://localhost:3050/comments/delete/:commentId
 */
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.deleted = true;
    await comment.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all comments
 * @function getAllComments
 * @param {*} req
 * @param {*} res
 * @returns All comments
 * @method GET
 * @example http://localhost:3050/comments
 */
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ deleted: false });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get comments by postId
 * @function getCommentsByPostId
 * @param {*} req
 * @param {*} res
 * @returns  Comments by postId
 * @method GET
 * @example http://localhost:3050/comments/commentsbypost/:postId
 */
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comments = await Comment.find({ post: post._id, deleted: false });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get comment by id
 * @function getCommentById
 * @param {*} req
 * @param {*} res
 * @returns  Comment by id
 * @method GET
 * @example http://localhost:3050/comments/:commentId
 */
export const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
