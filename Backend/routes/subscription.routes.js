import Router from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  createSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller.js";

const routerSubscription = Router();

/*
routerSubscription.get("/", authenticate, authorize(["admin"]), getSubscriptions);
routerSubscription.get(
  "/:id",
  authenticate,
  authorize(["user", "admin"]),
  getSubscriptionById
);
routerSubscription.patch(
  "/update/:id",
  authenticate,
  authorize(["user", "admin"]),
  updateSubscription
);
routerSubscription.post(
  "/",
  authenticate,
  authorize(["user", "admin"]),
  createSubscription
);
routerSubscription.patch(
  "/delete/:id",
  authenticate,
  authorize(["admin"]),
  deleteSubscription
);
*/

routerSubscription.get("/", getSubscriptions);
routerSubscription.get("/:id", getSubscriptionById);
routerSubscription.patch("/update/:id", updateSubscription);
routerSubscription.post("/", createSubscription);
routerSubscription.patch("/delete/:id", deleteSubscription);

export default routerSubscription;