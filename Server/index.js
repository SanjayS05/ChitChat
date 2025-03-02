import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Lib/socket.js";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/messages.routes.js"
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./Lib/db.js";

import path from "path";

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/Client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Client", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});
