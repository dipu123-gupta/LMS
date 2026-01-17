import cookieParser from 'cookie-parser';
import { config } from "dotenv";
config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/user.routes.js'

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.use('/ping', (req, res) => {
    res.send('/pong');
});

// route of 3 modules
app.use('/api/vi/user', authRouter)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware);

export default app;