const AuditLog = require("../models/auditLog"); // Make sure to adjust the path as needed

const logAuditEvent = async (
  eventType,
  eventDescription,
  affectedEntity,
  entityId,
  userId
) => {
  try {
    const newLog = new AuditLog({
      eventType,
      eventDescription,
      affectedEntity,
      entityId,
      userId, // User ID who performed the action
    });

    await newLog.save(); // Save the audit log to the database
  } catch (err) {
    console.error("Error logging audit event:", err);
  }
};

module.exports = logAuditEvent;
