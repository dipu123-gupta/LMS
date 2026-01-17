import User from "../models/user.models.js";
import AppError from "../utils/error.util.js";
// import cloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


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

    // console.log("sjhdgjg", JSON.stringify(req.file));
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
        fs.rmSync(`uploadds/${req.file.filename}`, { force: true });

      } catch (error) {
        new AppError(error || 'File not uploaded , please try again', 500)
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
    // ✅ SAFETY FIX
    if (typeof next === "function") {
      return next(error);
    }

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
    user.password = undefined;

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
const logout = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export { register, login, profile, logout };
