import express from "express";

import {
  register,
  login,
  profile,
  logout,
} from "../controllers/user.controller.js";

import upload from "../middlewares/multer.middleware.js";
import isLoginedIn from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// ✅ REGISTER
// ❗ controller ko CALL nahi karna, sirf reference dena hai
authRouter.post(
  "/register",
  upload.single("avatar"),
  register
);

// ✅ LOGIN
authRouter.post("/login", login);

// ✅ PROFILE
authRouter.get("/profile", isLoginedIn, profile);

// ✅ LOGOUT
authRouter.get("/logout", isLoginedIn, logout);

export default authRouter;
