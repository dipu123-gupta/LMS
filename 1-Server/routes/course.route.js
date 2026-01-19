import { Router } from "express";
import {
  createCourse,
  getAllCourse,
  getLectureByCourseId,
  removeCourse,
  updateCourse,
  AddLectureToCourseById,
} from "../controllers/course.controllor.js"; // ✅ spelling fixed

import upload from "../middlewares/multer.middleware.js";
import { authorizedRole, authorizedSubscriber, isLoggedIn } from "../middlewares/auth.middleware.js";

const courseRouter = Router();

// GET all courses
courseRouter.get("/", getAllCourse);

// CREATE course
courseRouter.post(
  "/",
  isLoggedIn,
  authorizedRole("admin"),
  upload.single("thumbnail"),
  createCourse
);

// GET lectures
courseRouter.get("/:id", isLoggedIn,authorizedSubscriber, getLectureByCourseId);

// UPDATE course
courseRouter.put("/:id", isLoggedIn, authorizedRole("admin"), updateCourse);

// DELETE course
courseRouter.delete("/:id", isLoggedIn, authorizedRole("admin"), removeCourse);

// ADD lecture (route fixed)
courseRouter.post(
  "/:id/lecture",
  isLoggedIn,
  authorizedRole("admin"),
  upload.single("thumbnail"),
  AddLectureToCourseById
);

export default courseRouter;
