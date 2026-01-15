// const { default: avatar } = require("daisyui/components/avatar");
const mongoose = require("mongoose");
// import { mongoose } from 'mongoose'
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 3,
            maxlength: 50,
            lowercase: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false, // password kabhi direct fetch nahi hoga
        },
        avatar: {
            public_id: {
                type: String,
            },
            secure_url: {
                type: String,
            },
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        forgotPasswordToken: String,
        forgotPasswordExpire: String,
    },

    {
        timestamps: true, // createdAt, updatedAt automatically
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods = {
    generateToken: async function () {
        return await jwt.sign(
            {
                id: this._id,
                email: this.email,
                subscription: this.subscription,
                role: this.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE }
        );
    },
    comparePassword: async function (plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
