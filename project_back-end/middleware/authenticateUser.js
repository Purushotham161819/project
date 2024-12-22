const jwt = require("jsonwebtoken");
const { jwtBlacklist } = require("../apis/authApi"); // Import jwtBlacklist from authApi.js

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to authenticate and check if the token is blacklisted
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    // Log for debugging
    console.log("Received Token:", token);

    // Check if the token is blacklisted
    if (jwtBlacklist.has(token)) {
      return res
        .status(401)
        .json({ message: "Token is blacklisted. Please log in again." });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to req.user

    console.log("Token is valid. Proceeding to next middleware.");

    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error("Error during token validation:", err);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;
