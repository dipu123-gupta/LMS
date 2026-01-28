import { Router } from "express";
import {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  getPaymentStats,
} from "../controllers/payment.controller.js";
import { authorizedRole, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// Get Razorpay Key
router.get("/razorpay-key", isLoggedIn, getRazorpayApiKey);

// Buy Subscription
router.post("/subscribe", isLoggedIn, buySubscription);

// Verify Subscription
router.post("/verify", isLoggedIn, verifySubscription);

router.post("/unsubscribe", isLoggedIn, cancelSubscription);

// router.get("/", isLoggedIn, authorizedRole("admin"), allPayments);

router.get("/stats", isLoggedIn, authorizedRole("admin"), getPaymentStats);

export default router;
