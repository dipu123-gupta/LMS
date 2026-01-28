import User from "../models/user.models.js";
import Course from "../models/course.model.js";
import Payment from "../models/payment.model.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";
import { razorpay } from "../server.js";

/* ===================== GET RAZORPAY KEY ===================== */
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

/* ======================= BUY COURSE (DYNAMIC PRICE) ======================= */
const buySubscription = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("Unauthorized", 401));
    if (!courseId) return next(new AppError("Course id missing", 400));

    const course = await Course.findById(courseId);
    if (!course) return next(new AppError("Course not found", 404));

    if (course.isFree || course.finalPrice === 0) {
      return next(new AppError("This course is free", 400));
    }

    const amount = course.finalPrice * 100;

    console.log("🟡 Razorpay creating order:", {
      amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `course_${Date.now()}`, // ✅ max 40 chars
    });

    console.log("✅ Razorpay order created:", order.id);

    res.status(200).json({
      success: true,
      order,
      courseId,
      amount: course.finalPrice,
    });
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    next(new AppError(err.message, 500));
  }
};

/* ================== VERIFY PAYMENT ================== */
const verifySubscription = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
      amount,
    } = req.body;

    const user = await User.findById(req.user.id);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment verification failed", 400));
    }

    // ✅ COURSE ACCESS
    if (!user.subscribedCourses.includes(courseId)) {
      user.subscribedCourses.push(courseId);
    }

    user.subscription.status = "active";
    await user.save();

    // 🔥 PAYMENT SAVE IN DB (MAIN FIX)
    await Payment.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      user: user._id,
    });

    console.log("✅ PAYMENT SAVING", {
      razorpay_payment_id,
      razorpay_order_id,
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified & course unlocked",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

/* ================== CANCEL SUBSCRIPTION ================== */
const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.subscription.status = "cancelled";
    user.subscribedCourses = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

/* ========================= ADMIN PAYMENT STATS ========================= */
const getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find();

    const monthlySalesRecod = new Array(12).fill(0);
    const monthlyRevenue = new Array(12).fill(0);
    let totalRevenue = 0;

    payments.forEach((p) => {
      const month = new Date(p.createdAt).getMonth();
      monthlySalesRecod[month] += 1;
      monthlyRevenue[month] += p.amount;
      totalRevenue += p.amount;
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      totalRevenue,
      monthlySalesRecod,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  getPaymentStats,
};
