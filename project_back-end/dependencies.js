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


module.exports = {
  server,
  mongoose,
  VALIDATION_PATTERNS,
};
