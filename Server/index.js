// Main server file with security configurations
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Lib/socket.js";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/messages.routes.js"
import dotenv from "dotenv";
import logger from "./Lib/logger.js";
import connectDB from "./Lib/db.js";
import {
    securityHeaders,
    rateLimiter,
    speedLimiter,
    sanitizeData,
    errorHandler,
    requestLogger
} from "./Middlewares/security.middleware.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Apply security middleware in order of importance
app.use(securityHeaders); // Prevent common web vulnerabilities
app.use(rateLimiter); // Prevent brute force attacks
app.use(speedLimiter); // Slow down suspicious requests
app.use(sanitizeData); // Sanitize user input
app.use(requestLogger); // Log security events

// Configure request parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Secure CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.CLIENT_URL] 
        : ["http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

// Protected API routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// Global error handler
app.use(errorHandler);

// Secure server startup
server.listen(PORT, () => {
    logger.info('Server Started', {
        port: PORT,
        environment: process.env.NODE_ENV
    });
    connectDB();
});

// Handle uncaught exceptions securely
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
        reason: reason.message,
        stack: reason.stack
    });
});
