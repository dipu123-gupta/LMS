import sendEmail from "../config/sendEmail.js";
import User from "../models/user.models.js";
import AppError from "../utils/error.util.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import crypto from "crypto";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError("Email already exists", 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      },
    });

    if (!user) {
      throw new AppError("User register failed please try again", 400);
    }

    // File upload
    if (req.file) {
      console.log(req.file);

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
        }

        // Remove file from server
        fs.rmSync(`uploads/${req.file.filename}`, { force: true });
      } catch (error) {
        new AppError(error || "File not uploaded , please try again", 500);
      }
    }

    await user.save();
    user.password = undefined;

    const token = user.generateToken();
    res.cookie("token", token, cookieOption);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    // fallback (rare case)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("All fields are required", 400);
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 400);
    }

    const token = user.generateToken();
    user.activeToken = token;
    await user.save();

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ================= PROFILE =================
const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: "User Details",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.activeToken = null;
      await user.save();
    }

    res.cookie("token", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ FIX
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};


// ================= FORGETPASSWORD =================
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Email not registered", 400));
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // ✉️ email content (HTML – exactly like image)
    const subject = "Reset Password";

    const message = `
  <h2>Password Reset</h2>

  <p>You requested to reset your password.</p>

  <p>
    <a href="${resetPasswordURL}"
       target="_blank"
       style="
         display:inline-block;
         padding:12px 20px;
         background:#2563eb;
         color:#ffffff;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;
       ">
       Reset Password
    </a>
  </p>

  <p>If the button does not work, copy and paste this link into your browser:</p>

  <p>${resetPasswordURL}</p>

  <p>This link will expire in 15 minutes.</p>
`;

    // 📧 send email
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: "Reset password link generated",
      resetPasswordURL, // test ke liye
    });
  } catch (error) {
    next(error);
  }
};

// ================= RESETPASSWORD =================
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // 🔴 token missing check
    if (!resetToken) {
      return next(new AppError("Reset token is missing", 400));
    }

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    if (password.length < 6) {
      return next(new AppError("Password must be at least 6 characters", 400));
    }

    const forgetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      forgetPasswordToken,
      forgetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError("Token is invalid or expired, please try again", 400),
      );
    }

    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // 🔑 Old password check
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new AppError("Old password is incorrect", 401));
    }

    // 🔒 New password set
    user.password = newPassword;
    await user.save();

    // 🍪 AUTO LOGOUT → token remove
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  if (name) {
    user.name = name;
  }

  if (req.file) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      }

      // Remove file from server
      fs.rmSync(`uploads/${req.file.filename}`, { force: true });
    } catch (error) {
      return next(new AppError(error.message || "File upload failed", 500));
    }
  }
  await user.save();

  res.status(200).json({
    success: true,
    message: "User detailed updated successfully",
  });
};

export {
  register,
  login,
  profile,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
