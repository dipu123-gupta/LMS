import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

// const isLoggedIn = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new AppError("Unauthenticated, please login again", 401));
//   }  
  
//   const payload = jwt.verify(token, process.env.SECRET_KEY);
//   req.user = payload;
//   next();
// };

import User from "../models/user.models.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new AppError("Unauthenticated", 401));

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.findById(decoded.id);

  if (!user || user.activeToken !== token) {
    return next(new AppError("Session expired", 401));
  }

  req.user = user; // 🔥 FULL USER
  next();
};





const authorizedRole = (...roles) =>
  async (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }

    next();
  };


const authorizedSubscriber = (req, res, next) => {
  const user = req.user;
  const courseId = req.params.id;

  if (user.role === "admin") return next();

  const hasAccess = user.subscribedCourses.some(
    (c) => c.toString() === courseId
  );

  if (!hasAccess) {
    return next(
      new AppError("You are not subscribed to this course", 403)
    );
  }

  next();
};

export { authorizedRole, isLoggedIn, authorizedSubscriber };
