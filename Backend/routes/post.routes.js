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

/*
routerPost.get("/", authenticate, authorize(["admin"]), getAllPosts);

routerPost.get(
  "/post/:id",
  authenticate,
  authorize(["user", "admin"]),
  getPostById
);

routerPost.patch(
  "/update/:id",
  authenticate,
  authorize(["user", "admin"]),
  updatePost
);

routerPost.patch(
  "/delete/:id",
  authenticate,
  authorize(["user", "admin"]),
  deletePost
);

routerPost.post(
  " /create",
  authenticate,
  authorize(["user", "admin"]),
  uploadImage.single("image"),
  createPost
);
*/

routerPost.get("/", getAllPosts);

routerPost.get("/post/:id", getPostById);

routerPost.patch("/update/:id", updatePost);

routerPost.patch("/delete/:id", deletePost);

routerPost.post("/create", uploadImage.single("image"), createPost);

routerPost.get("/prueba", prueba);

export default routerPost;
