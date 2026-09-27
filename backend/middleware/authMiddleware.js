import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || 'communi_event_super_secret_jwt_key_2026';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. No token provided."
        });
    }

    if (!authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = db.users.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found."
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
    return token;
};