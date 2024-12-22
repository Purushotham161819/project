const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User schema
const recipientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Removes leading and trailing spaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique in the database
    lowercase: true, // Converts email to lowercase before saving
    trim: true,
  },
});

// Create the User model
const Recipient = mongoose.model("Recipient", recipientSchema);

module.exports = Recipient;
