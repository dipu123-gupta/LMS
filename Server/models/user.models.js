import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      ]
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    avatar: {
      public_id: String,
      secure_url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    forgetPasswordToken: {
      type: String
    },
    forgetPasswordExpiry: {
      type: String,
    }
  },
  { timestamps: true }
);

// ✅ CORRECTED: Remove next entirely - cleaner and works with async
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;