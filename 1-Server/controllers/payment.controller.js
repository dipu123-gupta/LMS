import User from "../models/user.models.js";
import Payment from "../models/payment.model.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";
import {razorpay} from "../server.js"; 

/* =========================
   GET RAZORPAY KEY
========================= */
const getRazorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =========================
   BUY SUBSCRIPTION
========================= */
const buySubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    if (user.role === "admin") {
      return next(
        new AppError("Admin cannot purchase a subscription", 400)
      );
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      subscription_id: subscription.id,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =========================
   VERIFY SUBSCRIPTION
========================= */
const verifySubscription = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(
        `${razorpay_payment_id}|${razorpay_subscription_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(
        new AppError("Payment not verified, please try again", 400)
      );
    }

    // ❌ Payment.create intentionally REMOVED
    // ✅ webhook will handle DB entry

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =========================
   CANCEL SUBSCRIPTION
========================= */
const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("Unauthorized, please login", 401));
    }

    if (user.role === "admin") {
      return next(
        new AppError("Admin cannot cancel subscription", 400)
      );
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(
      subscriptionId
    );

    user.subscription.status = subscription.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =========================
   GET ALL PAYMENTS (ADMIN)
========================= */
const allPayments = async (req, res, next) => {
  try {
    const count = Number(req.query.count) || 10;

    const subscriptions = await razorpay.subscriptions.all({
      count,
    });

    res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments,
};
