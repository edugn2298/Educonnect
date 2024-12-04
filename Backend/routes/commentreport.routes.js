import {
  getFilteredComments,
  downloadPDFReport,
} from "../controllers/commentreport.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredComments);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
