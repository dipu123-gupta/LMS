import crypto from "crypto";
import User from "../models/user.models.js";
import Payment from "../models/payment.model.js";
import AppError from "../utils/error.util.js";

const razorpayWebhook = async (req, res, next) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // 🔥 RAW BODY -> STRING -> JSON
    const rawBody = req.body.toString();
    const body = JSON.parse(rawBody);

    console.log("🔥 WEBHOOK EVENT:", body.event);
    console.log("🔥 WEBHOOK BODY:", JSON.stringify(body, null, 2));

    // ✅ Signature verify (RAW BODY use karo)
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (generatedSignature !== signature) {
      return next(new AppError("Invalid webhook signature", 400));
    }

    const event = body.event;
    const payload = body.payload;

    /* ======================
       PAYMENT SUCCESS
    ====================== */
    if (event === "subscription.charged") {
      const subscriptionId = payload.subscription.entity.id;

      // 🔥 SAFE payment entity (ALL CASES)
      const paymentEntity =
        payload.payment?.entity ||
        payload.subscription?.entity?.payment;

      if (!paymentEntity?.id) {
        console.log("❌ Payment entity missing");
        return res.status(200).json({ success: true });
      }

      const paymentId = paymentEntity.id;

      // 🔁 Duplicate payment check
      const exists = await Payment.findOne({
        razorpay_payment_id: paymentId,
      });

      if (exists) {
        console.log("⚠️ Payment already saved, skipping");
        return res.status(200).json({ success: true });
      }

      const amount = paymentEntity.amount / 100; // paise → rupees

      const user = await User.findOne({
        "subscription.id": subscriptionId,
      });

      await Payment.create({
        razorpay_payment_id: paymentId,
        razorpay_subscription_id: subscriptionId,
        razorpay_signature: signature,
        amount,
        user: user?._id,
      });

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionId },
        { "subscription.status": "active" }
      );

      console.log("✅ Payment saved in DB");
    }

    /* ======================
       SUBSCRIPTION CANCELLED
    ====================== */
    if (event === "subscription.cancelled") {
      const subscriptionId = payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionId },
        { "subscription.status": "cancelled" }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export default razorpayWebhook;
