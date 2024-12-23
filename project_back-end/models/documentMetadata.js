const mongoose = require("mongoose");

const documentMetadataSchema = new mongoose.Schema({
  templateId: { type: String, required: true }, // The ID of the template used
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipient",
    required: true,
  }, // The recipient of the document
  documentPath: { type: String, required: true }, // Path where the document is saved
  status: { type: String, enum: ["pending", "signed"], default: "pending" }, // Document status
  createdAt: { type: Date, default: Date.now }, // Timestamp when the document was created
  signedAt: { type: Date, default: null }, // Timestamp when the document was signed
});

const DocumentMetadata = mongoose.model(
  "DocumentMetadata",
  documentMetadataSchema
);

module.exports = DocumentMetadata;
