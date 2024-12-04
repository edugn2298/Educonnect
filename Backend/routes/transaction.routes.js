import Router from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUser,
  getTransactionsByStatus,
  getTransactionsByPaymentMethod,
  getTransactionsByCurrency,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", authenticate, authorize(["user", "admin"]), createTransaction);
router.get("/", authenticate, authorize(["admin"]), getTransactions);
router.get(
  "/:id",
  authenticate,
  authorize(["user", "admin"]),
  getTransactionById
);
router.patch(
  "/:id",
  authenticate,
  authorize(["user", "admin"]),
  updateTransaction
);
router.delete("/:id", authenticate, authorize(["admin"]), deleteTransaction);

router.get(
  "/user/:id",
  authenticate,
  authorize(["user", "admin"]),
  getTransactionsByUser
);
router.get(
  "/status/:status",
  authenticate,
  authorize(["user", "admin"]),
  getTransactionsByStatus
);
router.get(
  "/paymentMethod/:paymentMethod",
  authenticate,
  authorize(["user", "admin"]),
  getTransactionsByPaymentMethod
);
router.get(
  "/currency/:currency",
  authenticate,
  authorize(["user", "admin"]),
  getTransactionsByCurrency
);

export default router;
