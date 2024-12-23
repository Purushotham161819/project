const { server } = require("../dependencies");
const Template = require("../models/template");

const docx = require("docx");
const fs = require("fs");
const path = require("path");
const { Packer, Document, Paragraph, TextRun } = docx;
const DocumentMetadata = require("../models/documentMetadata"); // Import the model

// Generate Document based on template and data
server.post("/generateDocument", async (req, res) => {
  const { templateId, recipientData } = req.body; // Receive templateId and recipient data

  // Validate inputs
  if (!templateId || !recipientData) {
    return res.status(400).json({ message: "Template ID and data are required." });
  }

  try {
    // Find the template using the provided templateId
    const template = await Template.findOne({ templateId });
    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    // Create the document dynamically
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: template.fields.map((field) => {
            const placeholder = field.placeholder;
            const fieldKey = placeholder.replace(/{{|}}/g, "");
            const value = recipientData[fieldKey] || "Not Provided";
            return new Paragraph({
              children: [new TextRun(`${field.label}: ${value}`)],
            });
          }),
        },
      ],
    });

    // Generate the document as a Word file (buffer)
    const buffer = await Packer.toBuffer(doc);

    // Define the document path in the root-level 'uploads' directory
    const uploadDir = path.join(__dirname, "../uploads"); // Root level 'uploads' directory
    const filePath = path.join(uploadDir, `generated_${templateId}.docx`);

    // Ensure the uploads directory exists, and create it if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Save the document to the 'uploads/' directory
    fs.writeFileSync(filePath, buffer);

    // Save document metadata to the database
    const documentMetadata = new DocumentMetadata({
      templateId,
      recipientId: recipientData._id, // Assuming the recipient data has an _id
      documentPath: filePath,
      status: "pending", // Document status set to 'pending'
    });

    await documentMetadata.save();

    // Return success response (only send response once)
    res.status(200).json({
      message: "Document generated successfully",
      filePath: `/uploads/generated_${templateId}.docx`, // URL to access the document
      documentMetadata: documentMetadata, // Optionally return the metadata for further reference
    });
  } catch (err) {
    console.error("Error generating document:", err);
    res.status(500).json({ message: "Failed to generate document", error: err.message });
  }
});
