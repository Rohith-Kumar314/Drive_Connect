import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authToken = req.cookies?.token;
    if (!authToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Token or Not Found" });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
