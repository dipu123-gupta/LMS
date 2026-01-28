import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_payment_id: {
      type: String,
      required: true,
      unique: true,
    },
    razorpay_order_id: {        // ✅ ADD
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
