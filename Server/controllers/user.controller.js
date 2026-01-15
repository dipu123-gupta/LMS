const User = require("../models/user.models");
const AppError = require("../utils/error.util");

const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

// ! register user
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new AppError('All fields Are required ', 400));
        }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('Email Already Exists', 400));
        }
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png'
            }
        })

        if (!user) {
            return next(new AppError('user registration faild please try again', 400));
        }

        await user.save();

        user.password = undefined;

        const token = await user.generateToken();

        res.cookie('token', token, cookieOption)

        res.status(201).json({
            success: true,
            message: 'User register Successfully',
            user
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

//! login user

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All field are required ', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password does not match', 400));
        }

        const token = await user.generateToken();
        res.cookie('token', token, cookieOption);

        res.status.json({
            successs: true,
            message: 'User Login Successfully',
            user,
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

//! get profile logined user

const profile = async (req, res) => {
    try {
     const userId =req.user.id;
     const user=await User.findById(userId);

     res.status(200).json({
        success:true,
        message:'User Details',
        user,
     })

    } catch (error) {
        return next(new AppError('Faield to fetch user profile', 400));
    }
}

//!user logout
const logout = async (req, res) => {
    try {
        res.cookie('token', null, {
            secure: true,
            maxAge: 0,
            httpOnly: true,
        })

        res.status(200).json({
            success: true,
            message: 'User logged out Successfully'
        })

    } catch (error) {
        res.status(500).send("Internal Error")
    }
}

//! user Detlete Profile
const deletes = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send("Internal Error")
    }
}

module.exports = { register, login, profile, logout, deletes }