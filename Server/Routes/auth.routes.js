// Authentication routes with input validation and security measures
import express from "express";
import authController from "../Controllers/auth.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import { validateInput, commonValidationRules } from "../Middlewares/security.middleware.js";
import loginLimiter from "../Lib/rateLimiter.js";

const router = express.Router();

// Register with strict input validation
router.post('/register', 
    validateInput([
        commonValidationRules.username,
        commonValidationRules.email,
        commonValidationRules.password
    ]),
    authController.register
);

// Login with validation and rate limiting
router.post('/login',
    validateInput([
        commonValidationRules.email,
        commonValidationRules.password
    ]),
    loginLimiter,
    authController.login
);

// Protected logout route
router.post('/logout', verifyToken, authController.logout);

// Protected profile update with validation
router.put('/update-profile', 
    verifyToken,
    validateInput([
        commonValidationRules.username.optional(),
        commonValidationRules.email.optional()
    ]),
    authController.updateProfile
);

// Protected auth status check
router.get('/check', verifyToken, authController.checkAuth);

export default router;
