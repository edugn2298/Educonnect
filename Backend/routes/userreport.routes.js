import { Router } from "express";
import {
  getFilteredUsers,
  downloadPDFReport,
} from "../controllers/userreport.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), getFilteredUsers);
router.get("/download", authenticate, authorize(["admin"]), downloadPDFReport);

export default router;
