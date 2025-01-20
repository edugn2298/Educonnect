import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { createOrder, captureOrder } from "../controllers/paypal.controller.js";

const RouterPaypal = Router();

RouterPaypal.post(
  "/createorder",
  authenticate,
  authorize(["user", "admin"]),
  createOrder
);
RouterPaypal.post(
  "/captureorder",
  authenticate,
  authorize(["user", "admin"]),
  captureOrder
);

export default RouterPaypal;
