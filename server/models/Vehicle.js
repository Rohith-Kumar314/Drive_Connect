import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    brand:String,
    model:String,
    purchaseYear:Date,
    price:{
        type:Number,
        default:450,
    },
    color:String,
    images:[],
},{timestamps:true});