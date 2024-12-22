const { server } = require("../dependencies");
const Recipient = require("../models/recipient");
const { VALIDATION_PATTERNS } = require("../dependencies");
const logAuditEvent = require("../helpers/auditLogHelper");
const authenticateUser = require("../middleware/authenticateUser"); 


// API to add recipient data
server.post("/addRecipient", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: "First name is required" });
    }

    if (!VALIDATION_PATTERNS.name.test(firstName)) {
      return res.status(400).json({
        message: "First name should contain only alphabets and spaces",
      });
    }

    if (!lastName) {
      return res.status(400).json({ message: "Last name is required" });
    }

    if (!VALIDATION_PATTERNS.name.test(lastName)) {
      return res.status(400).json({
        message: "Last name should contain only alphabets and spaces",
      });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!VALIDATION_PATTERNS.email.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const newRecipient = new Recipient({ firstName, lastName, email });
    await newRecipient.save();

    // Log the event in the audit log
    await logAuditEvent(
      "CREATE", // event type
      "Created a new recipient", // event description
      "Recipient", // affected entity (Recipient)
      newRecipient._id, // recipient ID
      req.user.id // Assuming req.user.id is available (from authentication)
    );

    res.status(201).json({
      message: "Recipient created successfully",
      recipient: newRecipient,
    });
  } catch (err) {
    console.error("Error creating Recipient", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


// API to get a recipient by id
server.get("/getRecipient/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recipient = await Recipient.findById(id);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Log the event in the audit log (Recipient retrieval)
    await logAuditEvent(
      "READ", // event type
      `Viewed recipient with ID ${id}`, // event description
      "Recipient", // affected entity (Recipient)
      recipient._id, // recipient ID
      req.user.id // Assuming req.user.id is available
    );

    res.status(200).json(recipient);
  } catch (error) {
    console.error("Error retrieving recipient", error);
    res.status(500).json({ message: "Failed to retrieve recipient", error: error.message });
  }
});


// API to update a recipient by id
server.put("/updateRecipient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const updatedRecipient = await Recipient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRecipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Log the event in the audit log (Recipient update)
    await logAuditEvent(
      "UPDATE", // event type
      `Updated recipient with ID ${id}`, // event description
      "Recipient", // affected entity (Recipient)
      updatedRecipient._id, // recipient ID
      req.user.id // Assuming req.user.id is available
    );

    res.status(200).json({
      message: "Recipient updated successfully",
      recipient: updatedRecipient,
    });
  } catch (error) {
    console.error("Error updating recipient", error);
    res.status(500).json({ message: "Failed to update recipient", error: error.message });
  }
});

module.exports = server;
