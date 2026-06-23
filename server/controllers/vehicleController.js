import { Vehicle } from "../models/Vehicle.js";

export const fetchAllVehicles = async (req, res, next)=>{
    try{
        const {lastId,limit} = req.query;
        const allVehicles = await Vehicle.find({_id:{$gt : lastId}}).limit(limit);
        res.status(200).json({success:true,message:"All vehicles fetched successfully", payload:allVehicles, lastDocId:allVehicles[allVehicles.length-1]._id});
    }catch(err){
        next(err);
    }
}