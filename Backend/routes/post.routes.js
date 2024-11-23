import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import uploadImage from "../middlewares/uploadImage.js";

/**
 * Post routes
 */
const routerPost = Router();

/**
 * Get all posts
 * @function getAllPosts
 * @Method GET
 */
routerPost.get("/", authenticate, authorize(["admin"]), getAllPosts);

/**
 * Get post by ID
 * @function getPostById
 * @Method GET
 */
routerPost.get(
  "/post/:id",
  authenticate,
  authorize(["user", "admin"]),
  getPostById
);

/**
 * Update post
 * @function updatePost
 * @Method PATCH
 */
routerPost.patch(
  "/update/:id",
  authenticate,
  authorize(["user", "admin"]),
  updatePost
);

/**
 * Delete post
 * @function deletePost
 * @Method DELETE
 */
routerPost.patch(
  "/delete/:id",
  authenticate,
  authorize(["user", "admin"]),
  deletePost
);

/**
 * Create post
 * @function createPost
 * @Method POST
 */
routerPost.post(
  " /create",
  authenticate,
  authorize(["user", "admin"]),
  uploadImage.single("image"),
  createPost
);

export default routerPost;
