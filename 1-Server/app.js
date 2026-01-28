import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.route.js";
import paymentRoutes from "./routes/payment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import contactRouter from "./routes/contact.route.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use("/api/v1/webhook", webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);



app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/user", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/contact", contactRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;
