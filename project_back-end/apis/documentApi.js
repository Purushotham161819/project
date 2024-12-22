const { server, upload } = require("../dependencies");
const Document = require("../models/document");

// API endpoint to upload a Word document
server.post("/fileUpload", upload.single("wordFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
});

// API to Upload Document
server.post("/uploadDocument", upload.single("wordFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newDocument = new Document({
      title: req.body.title,
      content: req.file.filename,
      authorId: req.body.authorId,
    });

    await newDocument.save();
    res.status(200).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload document", error: error.message });
  }
});

// API to Retrieve Document
server.get("/document/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve document", error: error.message });
  }
});

module.exports = server;
