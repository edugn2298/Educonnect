import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
} from "../controllers/user.controller.js";
import uploadImage from "../middlewares/uploadImage.js";
import upload from "../middlewares/uploadImage.js";

const router = Router();

router.get("/", authenticate, authenticate, authorize(["admin"]), getAllUsers);
router.get(
  "/profile/:id",
  authenticate,
  authorize(["user", "admin"]),
  getUserById
);
router.patch(
  "/update/:id",
  authenticate,
  authorize(["user", "admin"]),
  upload.single("photo"),
  updateUser
);
router.patch("/delete/:id", authenticate, authorize(["admin"]), deleteUser);
router.patch(
  "/follow/:id",
  authenticate,
  authorize(["user", "admin"]),
  followUser
);
router.patch(
  "/unfollow/:id",
  authenticate,
  authorize(["user", "admin"]),
  unfollowUser
);
router.get(
  "/followers/:id",
  authenticate,
  authorize(["user", "admin"]),
  getFollowers
);
router.get(
  "/following/:id",
  authenticate,
  authorize(["user", "admin"]),
  getFollowing
);

router.get("/search", authenticate, authorize(["user", "admin"]), searchUsers);

export default router;
