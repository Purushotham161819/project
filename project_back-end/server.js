const { server } = require("./dependencies");
const authenticateUser = require("./middleware/authenticateUser"); // Import authenticateUser middleware
// Apply authenticateUser globally for all routes that follow
server.use(authenticateUser);
require("./apis/templateApi"); // Template API routes
require("./apis/recipientApi"); // Recipient API routes
require("./apis/documentApi"); // Document API routes
require("./apis/authApi"); // Ensure the signup/lgin route is available

const { logout } = require("./apis/authApi"); // Import logout function

// Logout route - can be called from anywhere in your app to log out
server.post("/logout", logout); // Use the logout function from authApi.js

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});
