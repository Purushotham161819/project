const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true, // Ensure every document is associated with a user
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
