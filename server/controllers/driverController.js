import { Driver } from "../models/Driver.js";
import { User } from "../models/Users.js";

export const registerDriver = async (req, res, next) => {
  try {
    const id = req?.user?.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid driver Id or Driver not found",
      });
    }
    const existingDriver = await Driver.findOne({ user: id });

    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: "Driver already registered",
      });
    }
    const { age, licenceNumber, experienceYears, city } = req.body;

    if (!age || !licenceNumber || !experienceYears || !city) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (age < 21) {
      return res.status(400).json({
        success: false,
        message: "Driver age should be greater than or equal to 21 years",
      });
    }

    if (experienceYears < 2) {
      return res.status(400).json({
        success: false,
        message: "driver should have atleast 2 years of experience",
      });
    }

    const newDriver = new Driver({
      user: id,
      age,
      licenceNumber,
      experienceYears,
      city,
    });

    const resp = await newDriver.save();
    res
      .status(201)
      .json({ success: true, message: "Driver Added Successfully" });
  } catch (err) {
    next(err);
  }
};
