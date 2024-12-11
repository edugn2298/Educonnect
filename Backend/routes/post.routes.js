import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  prueba,
} from "../controllers/post.controller.js";
import uploadImage from "../middlewares/uploadImage.js";

/**
 * Post routes
 */
const routerPost = Router();

/**
 * @method GET
 * @description Get all posts
 */
routerPost.get("/", authenticate, authorize(["admin"]), getAllPosts);

/**
 * @method GET
 * @description Get post by id
 */
routerPost.get(
  "/postbyid/:id",
  authenticate,
  authorize(["user", "admin"]),
  getPostById
);

/**
 * @method PATCH
 * @description Update post
 */
routerPost.patch(
  "/update/:id",
  authenticate,
  authorize(["user", "admin"]),
  updatePost
);

/**
 * @method PATCH
 * @description Delete post
 */
routerPost.patch(
  "/delete/:id",
  authenticate,
  authorize(["user", "admin"]),
  deletePost
);

/**
 * @method POST
 * @description Create post
 */
routerPost.post(
  "/create",
  authenticate,
  authorize(["user", "admin"]),
  uploadImage.single("image"),
  createPost
);

export default routerPost;
