import express from "express";
import {
  register,
  login,
  profile,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile
} from "../controllers/user.controller.js";

import upload from "../middlewares/multer.middleware.js";
import isLoginedIn from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), register);
authRouter.post("/login", login);
authRouter.get("/profile", isLoginedIn, profile);
authRouter.get("/logout", isLoginedIn, logout);

// ✅ FORGOT PASSWORD
authRouter.post("/forgotpassword", forgetPassword);
authRouter.post("/reset-password/:resetToken", resetPassword);
authRouter.post("/change-password", isLoginedIn, changePassword);
authRouter.put("/update", upload.single("avatar"), isLoginedIn, updateProfile);

export default authRouter;
