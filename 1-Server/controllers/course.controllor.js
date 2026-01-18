import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";


/* =======================
   GET ALL COURSES
======================= */
const getAllCourse = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =======================
   GET LECTURES BY COURSE ID
======================= */
const getLectureByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =======================
   CREATE COURSE
======================= */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: "dummy",
        secure_url: "dummy",
      },
    });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms",
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.rm(req.file.path);
    }

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};


/* =======================
   UPDATE COURSE
======================= */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(
      id,
      // { $set: req.body },
      // { runValidators: true ,new:true},
    );

    if (!course) {
      return next(new AppError("Course with given id does not exist", 404));
    }

    const { title, description, category } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;

    if (req.file) {
      // delete old thumbnail
      if (course.thumbnail.public_id) {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms",
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      fs.rmSync(req.file.path);
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =======================
   DELETE COURSE
======================= */
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    if (course.thumbnail.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/* =======================
   AddLectureToCourseById COURSE
======================= */
const AddLectureToCourseById = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError("Course does not exist", 404));
    }

    const lectureData = {
      title,
      description,
      lecture: {},
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms/lectures",
      });

      lectureData.lecture = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.rm(req.file.path);
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;

    await course.save(); // ✅ FIXED

    res.status(200).json({
      success: true,
      message: "Lecture successfully added",
      course,
    });
  } catch (error) {
    next(error);
  }
};


export {
  getAllCourse,
  getLectureByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  AddLectureToCourseById,
};
