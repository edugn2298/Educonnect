import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();
/*
router.get("/", getAllUsers);
router.get("/profile/:id", getUserById);
router.patch("/update/:id", updateUser);
router.patch("/delete/:id", deleteUser);
*/

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
  updateUser
);
router.patch("/delete/:id", authenticate, authorize(["admin"]), deleteUser);

export default router;
