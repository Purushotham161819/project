const { server } = require("./dependencies");
const express = require("express");
const path = require("path");
const cors = require('cors');

// Enable CORS (if needed for other services, like development tools)
server.use(cors());

// Middleware to parse JSON
server.use(express.json());

// Serve Angular app files
server.use(express.static(path.join(__dirname, '../project_front-end/dist/project-front-end')));

// Serve Angular's index.html for all unknown routes
server.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/project-front-end/index.html'));
});


// Serve files from the 'uploads' directory located in the root of the project
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authenticateUser = require("./middleware/authenticateUser"); // Import authenticateUser middleware
// Apply authenticateUser globally for all routes that follow
server.use(authenticateUser);

require("./apis/templateApi"); // Template API routes
require("./apis/recipientApi"); // Recipient API routes
require("./apis/authApi"); // Ensure the signup/login route is available
require("./apis/documentGenerationApi"); // Import document generation API routes

const { logout } = require("./apis/authApi"); // Import logout function

// Logout route - can be called from anywhere in your app to log out
server.post("/logout", logout); // Use the logout function from authApi.js

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
