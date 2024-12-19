import { Router } from "express";
import {
  loginUser,
  createUser,
  logOutUser,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/user/login", loginUser);
router.post("/user/register", createUser);
router.post("/user/logout", authenticate, logOutUser);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/reset-password/:token", forgotPassword);

export default router;
