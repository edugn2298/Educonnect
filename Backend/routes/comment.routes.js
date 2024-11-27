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

/*
routerComment.post(
  "/",
  authenticate,
  authorize(["user", "admin"]),
  createComment
);


routerComment.get("/", authenticate, authorize(["admin"]), getAllComments);
routerComment.get(
  "/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  getCommentById
);


routerComment.get("/commentsbypost/:postId", getCommentsByPostId);


routerComment.patch(
  "/update/:commentId",
  authenticate,
  authorize(["user", "admin"]),
  updateComment
);


routerComment.patch(
  "/delete/:commentId",
  authenticate,
  authorize(["admin"]),
  deleteComment
);
*/

routerComment.post("/", createComment);
routerComment.get("/", authenticate, authorize(["admin"]), getAllComments);
routerComment.get("/:commentId", getCommentById);
routerComment.get("/commentsbypost/:postId", getCommentsByPostId);
routerComment.patch("/update/:commentId", updateComment);
routerComment.patch("/delete/:commentId", deleteComment);

export default routerComment;
