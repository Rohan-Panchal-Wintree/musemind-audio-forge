import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes by verifying JWT from cookies.
 * If valid, sets `req.user` with decoded token payload.
 */

const protect = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
