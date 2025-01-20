import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

/**
 * Comment routes
 */
const routerComment = Router();

/**
 * @method POST
 * @description Create a new comment
 */
routerComment.post(
  "/",
  authenticate,
  authorize(["user", "admin"]),
  createComment
);

/**
 * @method GET
 * @description Get all comments
 */
routerComment.get("/", authenticate, authorize(["admin"]), getAllComments);
routerComment.get(
  "/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  getCommentById
);

/**
 * @method GET
 * @description Get comments by post
 */
routerComment.get("/commentsbypost/:postId", getCommentsByPostId);

/**
 * @method PATCH
 * @description Update a comment
 */
routerComment.patch(
  "/update/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  updateComment
);

/**
 * @method PATCH
 * @description Delete a comment
 */
routerComment.patch(
  "/delete/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  deleteComment
);

/**
 * @method GET
 * @description Get comments by post
 */
routerComment.get(
  "/commentsbypost/:postId",
  authenticate,
  authorize(["user", "admin"]),
  getCommentsByPostId
);

export default routerComment;
