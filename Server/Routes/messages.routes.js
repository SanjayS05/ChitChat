import express from "express";
import messageController from "../Controllers/messages.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.get('/users', verifyToken, messageController.getUserSidebar);
router.get('/:id', verifyToken, messageController.getMessages);

router.post('/send/:id', verifyToken, messageController.sendMessages);

export default router;