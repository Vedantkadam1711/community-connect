import bcrypt from "bcryptjs";

import { db } from "../config/db.js";

import {
    generateToken
} from "../middleware/authMiddleware.js";


export const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;



        if (!name || name.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Name is required."
            });

        }

        if (!email || email.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Email is required."
            });

        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email.trim())) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
            });

        }


        if (!password || password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters."
            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();


        const existingUser =
            db.users.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists."
            });

        }


        const assignedRole =
            role === "ORGANIZER"
                ? "ORGANIZER"
                : "USER";



        const hashedPassword =
            await bcrypt.hash(password, 10);


        const newUser = db.users.create({

            name: name.trim(),

            email: normalizedEmail,

            password: hashedPassword,

            role: assignedRole

        });


        const token =
            generateToken(newUser);


        return res.status(201).json({

            success: true,

            message:
                "Account registered successfully.",

            token,

            user: {

                _id: newUser._id,

                name: newUser.name,

                email: newUser.email,

                role: newUser.role,

                createdAt: newUser.createdAt

            }

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;



        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();



        const user =
            db.users.findOne({

                email: normalizedEmail

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }



        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }



        const token =
            generateToken(user);

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {

                _id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                createdAt: user.createdAt

            }

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};


export const getProfile = async (req, res) => {

    try {


        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        return res.status(200).json({

            success: true,

            user: {

                _id: req.user._id,

                name: req.user.name,

                email: req.user.email,

                role: req.user.role,

                createdAt: req.user.createdAt

            }

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Server error retrieving profile."

        });

    }

};