import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"],
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:6
    },
    mobileNo:{
        type:String,
        required:[true,"Mobile number  is required"],
        unique:true, //it cant be written as an error message like above since it only creates 
        match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"],
    },
    role:{
        type:String,
        enum:["user","driver","owner", "admin"],
        required:[true,"Role is required"],
        default:"user"
    }
},{timestamps:true});

export const User = mongoose.model('User',userSchema);