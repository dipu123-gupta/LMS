import { Router } from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/stats",
  isLoggedIn,
  authorizedRole("admin"),
  getAdminStats
);

export default router;
