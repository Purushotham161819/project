const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
  eventType: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  affectedEntity: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "affectedEntity", // Refers to the entity collection
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Assuming you have a User model
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
