import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { login, logout, register } from "../controllers/authController.js";

export const authRouter = Router();

//register route
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', authMiddleware,logout);