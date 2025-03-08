import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Lib/socket.js";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/messages.routes.js"
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./Lib/db.js";

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://chitchat-client-cs6j.onrender.com"],
    credentials: true,
}))

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);


server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});
