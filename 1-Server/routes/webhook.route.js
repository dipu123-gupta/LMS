import express from "express";
import razorpayWebhook from "../controllers/webhook.controller.js";


const webhookRouter = express.Router();

// ❗ raw body required
webhookRouter.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

export default webhookRouter;
