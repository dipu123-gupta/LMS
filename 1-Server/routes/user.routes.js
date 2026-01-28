import express from "express";
import {
  register,
  login,
  profile,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile,
} from "../controllers/user.controller.js";

import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js"; // ✅ FIX

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), register);
authRouter.post("/login", login);
authRouter.get("/profile", isLoggedIn, profile);
authRouter.post("/logout", isLoggedIn, logout);

authRouter.post("/forgotpassword", forgetPassword);
authRouter.post("/reset-password/:resetToken", resetPassword);
authRouter.post("/change-password", isLoggedIn, changePassword);
authRouter.put("/update", upload.single("avatar"), isLoggedIn, updateProfile);
authRouter.get("/subscription/status",isLoggedIn,(req, res) => {
    res.status(200).json({
      success: true,
      status: req.user.subscription?.status || "inactive",
    });
  }
);


export default authRouter;
