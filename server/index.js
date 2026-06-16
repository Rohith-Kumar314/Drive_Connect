import e from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./utils/logger.js";
import { setupSwagger } from "./config/swagger.js";
import { authRouter } from "./routes/authRoutes.js";
import cors from "cors";
import { User } from "./models/Users.js";
import { hash,compare } from "bcrypt";
import { Driver } from "./models/Driver.js";
import jwt from 'jsonwebtoken';
import { success } from "zod";

config();

const app = e();
setupSwagger(app);
app.use(e.json());
app.use(cookieParser());
// app.use(cors());

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/DriveConnect";

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Root resonse being seng" });
});

app.post("/register", async (req, res) => {
  try {
    let { firstName, lastName, email, password, mobileNo, role } = req.body;
    if (!firstName || !lastName || !email || !password || !mobileNo || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNo,
      role,
    });

    const resp = await newUser.save();

    res
      .status(201)
      .json({
        success: true,
        message: "User registered succesfully",
        payload: resp,
      });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Login User Route
app.post('/login',async(req,res,next)=>{
  try{
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({success:false, message:"All Fields required"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({success:false,message:"No User exists with the mail Id"});
    }

    const isMatch = await compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({success:false,message:"Invalid credentials"});
    }
    
    const token = jwt.sign({id:user._id,email:user.email,username:user.firstName,role:user.role},process.env.JWT_SECRET,{expiresIn:"24h"});
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    });

    return res.status(200).json({success:true,message:"User Logged In Succcessfully"})
  }catch(err){
    next(err);
  }
})


// Global Error handler
app.use((err, req, res, next) => {

  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: err.message
    });
  }

  // Cast Error (invalid ObjectId etc.)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
      error: err.value
    });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: "Duplicate Key Error",
      error: `${field} already exists`
    });
  }

  // Default
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
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
