import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({ message: "Unauthorized - No token provided" });
        }
        
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyUser) {
            return res.status(400).json({ message: "Unauthorized - Invalid token" });
        }
        
        const user = await User.findById(verifyUser.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}