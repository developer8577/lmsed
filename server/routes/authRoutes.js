import express from 'express';
import { syncUser, getUserData } from '../controllers/authController.js';
import { protectUser } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/sync', protectUser, syncUser);
authRouter.get('/data', protectUser, getUserData);

export default authRouter;
