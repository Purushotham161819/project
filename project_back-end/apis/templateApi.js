const { server } = require("../dependencies");
const Template = require("../models/template");

// API to create a new template
server.post("/createTemplate", async (req, res) => {
  const { templateId, name, fields, status } = req.body;

  if (!templateId || !name || !Array.isArray(fields)) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const existingTemplate = await Template.findOne({ templateId });
    if (existingTemplate) {
      return res.status(400).json({ error: "Template ID already exists." });
    }

    const newTemplate = new Template({
      templateId,
      name,
      fields,
      status: status || "active",
    });

    const template = await newTemplate.save();
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error saving template", details: err.message });
  }
});

// API to retrieve all templates
server.get("/retrieveAllTemplates", async (req, res) => {
  try {
    const templates = await Template.find({});
    res.status(200).json(templates);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error retrieving templates", details: err.message });
  }
});

// API to retrieve a specific template by templateId

server.get("/retrieveTemplate/:templateId", async (req, res) => {
  try {
    const template = await Template.findOne({
      templateId: req.params.templateId,
    });
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json(template);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error retrieving template", details: err.message });
  }
});

// API to update a template by templateId
server.put("/updateTemplate/:templateId", async (req, res) => {
  const { templateId } = req.params;
  const updateData = req.body;

  try {
    const updatedTemplate = await Template.findOneAndUpdate(
      { templateId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(200).json(updatedTemplate);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error updating template", details: err.message });
  }
});

module.exports = server;
