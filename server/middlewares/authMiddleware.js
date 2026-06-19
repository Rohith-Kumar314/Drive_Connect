import { jwt } from "zod";

export const authMiddleware = (req, res, next) => {
    try{
        const authToken = req.cookies?.token;
        if(!authToken){
            return res.status(401).json({success:false,message:"Invalid Token or Not Found"});
        }
        
    }catch(err){
        next(err);
    }
}