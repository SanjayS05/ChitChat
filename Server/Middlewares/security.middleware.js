// Security middleware for protecting against common web vulnerabilities
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { body, validationResult } from 'express-validator';
import logger from '../Lib/logger.js';

// Configure security headers to prevent common attacks
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
});

// Rate limiting to prevent brute force and DoS attacks
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Slow down requests after threshold to prevent automated attacks
export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: 500
});

// Sanitize user input to prevent NoSQL injection and XSS attacks
export const sanitizeData = [
    mongoSanitize(),
    xss(),
];

// Validate and sanitize user input
export const validateInput = (rules) => {
    return [
        rules,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.warn('Validation Error', {
                    errors: errors.array(),
                    path: req.path,
                    method: req.method
                });
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

// Common validation rules for user input
export const commonValidationRules = {
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    password: body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    
    username: body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
};

// Handle errors securely without exposing sensitive information
export const errorHandler = (err, req, res, next) => {
    logger.error('Error Handler', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    const errorResponse = {
        message: process.env.NODE_ENV === 'production' 
            ? 'An error occurred' 
            : err.message,
        status: err.status || 500
    };

    res.status(errorResponse.status).json(errorResponse);
};

// Log security-relevant request information
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request Completed', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    next();
}; 