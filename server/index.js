import e from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./utils/logger";
import { setupSwagger } from "./swagger.js";
import {setupSwagger} from "./config/swagger.js"

config();

const app = e();
setupSwagger(app);
app.use(e.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/DriveConnect';


const ConnectDB = async()=>{
    try{
        await mongoose.connect(DB_URL);
        console.log('DB Connected Successfully');
        logger.info("DB Connected Successfully");

        app.listen(PORT,()=>{
            console.log("Server Started");
        })
    }catch(err){
        console.log('ERROR : ', err);
        logger.error("DB Connection Failed",err);
    }
}