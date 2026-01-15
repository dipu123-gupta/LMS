const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error.middleware.js');
const authRouter=require('./routes/user.routes.js')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(cors({
    origin: [process.env.FRONTENT_URL],
    Credential: true
}))


app.use('/ping', (req, res) => {
    res.send('/pong');
});

app.use('/api/vi/user',authRouter)

// route of 3 modules

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware)




module.exports = app;