import crypto from "crypto";
import User from "../models/user.models.js";
import Payment from "../models/payment.model.js";
import AppError from "../utils/error.util.js";

const razorpayWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (generatedSignature !== signature) {
      return next(new AppError("Invalid webhook signature", 400));
    }

    const event = req.body.event;
    const payload = req.body.payload;

    /* ======================
       PAYMENT SUCCESS
    ====================== */
    if (
      event === "subscription.charged" ||
      event === "subscription.completed"
    ) {
      const subscriptionId =
        payload.subscription.entity.id;

      const paymentId =
        payload.payment.entity.id;

      // ✅ prevent duplicate payment entry
      await Payment.findOneAndUpdate(
        { razorpay_payment_id: paymentId },
        {
          razorpay_payment_id: paymentId,
          razorpay_subscription_id: subscriptionId,
          razorpay_signature: signature,
        },
        { upsert: true, new: true }
      );

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionId },
        { "subscription.status": "active" },
        { new: true }
      );
    }

    /* ======================
       SUBSCRIPTION CANCELLED
    ====================== */
    if (event === "subscription.cancelled") {
      const subscriptionId =
        payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionId },
        { "subscription.status": "cancelled" },
        { new: true }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export default razorpayWebhook;
