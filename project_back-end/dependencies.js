const express = require("express");
const server = express();
server.use(express.json());
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/signatures";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const VALIDATION_PATTERNS = {
  name: /^[A-Za-z]+( [A-Za-z]+)*$/, // Alphabets and single spaces
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
};

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
console.log(`Upload Directory: ${uploadDir}`);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created.');
} else {
  console.log('Uploads directory already exists.');
}

// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Save file with a unique name
  }
});

// File filter to only allow Word documents
const fileFilter = (req, file, cb) => {
  // Check if the file is a Word document (doc, docx)
  if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only Word documents (.doc, .docx) are allowed!'), false);
  }
};

// Initialize multer with storage options and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

module.exports = {
  server,
  mongoose,
  VALIDATION_PATTERNS,
  upload,
};
