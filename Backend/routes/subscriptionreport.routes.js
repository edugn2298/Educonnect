import { Router } from "express";
import {
  getFilteredSubscriptions,
  downloadPDFReport,
} from "../controllers/subscriptionreport.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredSubscriptions);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
