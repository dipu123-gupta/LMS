
const express = require('express');
const { register, login, profile, logout, deletes } = require('../controllers/user.controller');


const authRouter = express.Router();


authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.get('/profile',isLoginedIn, profile)

authRouter.post('/logout',isLoginedIn, logout)

authRouter.delete('/deleteProfile',isLoginedIn, deletes)

module.exports = authRouter;