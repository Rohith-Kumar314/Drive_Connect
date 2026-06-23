import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { registerDriver } from "../controllers/driverController";

export const driverRouter = Router();

driverRouter.post('/drivers',authMiddleware,registerDriver);