const { server } = require("../dependencies");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// In-memory blacklist to store blocked tokens temporarily
const jwtBlacklist = new Set(); // Using Set for fast lookup

// Duration for token blocking (e.g., 15 minutes in milliseconds)
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

// Login API
server.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Use the matchPassword method to compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error during login process:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign-Up API
server.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create the new user
    const newUser = new User({ username, password });

    console.log("User being saved to DB (before saving):", newUser);

    await newUser.save();

    console.log("User saved to DB (after saving):", newUser);

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout API to invalidate the token
const logout = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "Token missing." });
  }

  // Add the token to the blacklist
  jwtBlacklist.add(token);

  // Log to verify it's added
  console.log(`Token ${token} added to blacklist.`);

  // Send the response after logging out
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { logout, jwtBlacklist };