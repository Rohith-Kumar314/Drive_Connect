import e from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./utils/logger.js";
import { setupSwagger } from "./config/swagger.js";
import { authRouter } from "./routes/authRoutes.js";
import cors from "cors";
import { Driver } from "./models/Driver.js";
import jwt from "jsonwebtoken";
config();

const app = e();
setupSwagger(app);
app.use(e.json());
app.use(cookieParser());
// app.use(cors());

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/DriveConnect";

// registering routes here..
app.use('/auth',authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Root resonse being seng" });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  logger.error("Error occurred", err);

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: err.message,
    });
  }

  // Cast Error (invalid ObjectId etc.)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
      error: err.value,
    });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: "Duplicate Key Error",
      error: `${field} already exists`,
    });
  }

  // Default
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const ConnectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB Connected Successfully");
    logger.info("DB Connected Successfully");

    app.listen(PORT, () => {
      console.log("Server Started");
    });
  } catch (err) {
    console.log("ERROR : ", err);
    logger.error("DB Connection Failed", err);
  }
};
ConnectDB();
