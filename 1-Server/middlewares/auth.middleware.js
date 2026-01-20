import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }  
  
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  req.user = payload;
  next();
};

const authorizedRole =(...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this route", 403),
      );
    }
    next();
  };

const authorizedSubscriber = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Unauthorized, please login", 401));
  }

  // ✅ Admin bypass
  if (user.role === "admin") {
    return next();
  }

  if (!user.subscription || user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route", 403));
  }

  next();
};

export { authorizedRole, isLoggedIn, authorizedSubscriber };
