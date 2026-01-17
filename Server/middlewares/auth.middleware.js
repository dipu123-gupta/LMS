import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoginedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new AppError("Unauthenticated, please login again", 400)
    );
  }

  const payloads = await jwt.verify(
    token,
    process.env.SECRET_KEY
  );

  req.user = payloads;
  next();
};
export default isLoginedIn;
