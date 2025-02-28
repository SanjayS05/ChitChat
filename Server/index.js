import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Lib/socket.js";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/messages.routes.js"
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./Lib/db.js";

 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});
