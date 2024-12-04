import { Router } from "express";
import {
  getFilteredPosts,
  downloadPDFReport,
} from "../controllers/postreport.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredPosts);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
