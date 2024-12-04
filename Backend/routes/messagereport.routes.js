import { Router } from "express";
import {
  getFilteredMessages,
  downloadPDFReport,
} from "../controllers/messagereport.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredMessages);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
