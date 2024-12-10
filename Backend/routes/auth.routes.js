import { Router } from "express";
import {
  loginUser,
  createUser,
  logOutUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/user/login", loginUser);
router.post("/user/register", createUser);
router.post("/user/logout", authenticate, logOutUser);

export default router;
