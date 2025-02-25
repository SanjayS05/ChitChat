import express from "express";
import authController from "../Controllers/auth.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.put('/update-profile', verifyToken, authController.updateProfile);

router.get('/check', verifyToken, authController.checkAuth);
export default router;
