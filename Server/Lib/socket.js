import { Server } from "socket.io";
import http from "http";
import express from "express";
import logger from "./logger.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://chitchat-client-cs6j.onrender.com", "https://chitchat-u82w.onrender.com"],
        credentials: true
    }
});

export function getRecieverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    logger.info('Socket Connected', {
        socketId: socket.id,
        userId: socket.handshake.query.userId
    });

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        logger.info('User Socket Mapped', {
            userId,
            socketId: socket.id
        });
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        logger.info('Socket Disconnected', {
            socketId: socket.id,
            userId: userId
        });

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Log any socket errors
    socket.on("error", (error) => {
        logger.error('Socket Error', {
            socketId: socket.id,
            userId: userId,
            error: error.message
        });
    });
});

export { io, app, server };
