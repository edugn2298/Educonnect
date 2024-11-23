import { Router } from "express";
import { loginUser, createUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/user/login", loginUser);
router.post("/user/register", createUser);

export default router;
