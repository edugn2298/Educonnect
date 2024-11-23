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
 *  Create comment
 * @function createComment
 * @Method POST
 * @example http://localhost:3050/comments
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @returns comment
 */
routerComment.post(
  "/",
  authenticate,
  authorize(["user", "admin"]),
  createComment
);
/**
 * Get all comments
 * @function getAllComments
 * @Method GET
 * @example http://localhost:3050/comments
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @returns All comments
 */
routerComment.get("/", authenticate, authorize(["admin"]), getAllComments);
routerComment.get(
  "/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  getCommentById
);
/**
 * Get comments by postId
 * @function getCommentsByPostId
 * @Method GET
 * @example http://localhost:3050/comments/commentsbypost/:postId
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @returns Comments by postId
 */
routerComment.get("/commentsbypost/:postId", getCommentsByPostId);
/**
 * Update comment
 * @function updateComment
 * @Method PATCH
 * @example http://localhost:3050/comments/update/:commentId
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @returns comment
 */
routerComment.patch(
  "/update/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  updateComment
);
/**
 * Delete comment
 * @function deleteComment
 * @Method PATCH
 * @example http://localhost:3050/comments/delete/:commentId
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @returns comment
 */
routerComment.patch(
  "/delete/:commentId",
  authenticate,
  authorize(["admin"]),
  deleteComment
);

export default routerComment;
