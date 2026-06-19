import { User } from "../models/Users.js";
import { hash,compare } from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const {sign} = jwt;

export const register = async (req, res,next) => {
  console.log(req.body);
  try {
    let { firstName, lastName, email, password, mobileNo, role } = req.body;
    if (!firstName || !lastName || !email || !password || !mobileNo || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
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
    const userResponse = {
      id: resp._id,
      firstName: resp.firstName,
      lastName: resp.lastName,
      email: resp.email,
      mobileNo: resp.mobileNo,
      role: resp.role,
    };

    res.status(201).json({
      success: true,
      message: "User registered succesfully",
      payload: userResponse,
    });
  } catch (err) {
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }
    next(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login User Route
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No User exists with the mail Id" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.firstName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "User Logged In Succcessfully" });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res
    .status(200)
    .json({ success: true, message: "User Logged Out Successfully" });
};
