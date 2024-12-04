import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getFilteredTransactions,
  downloadPDFReport,
} from "../controllers/trasanc.report.controller.js";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredTransactions);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
