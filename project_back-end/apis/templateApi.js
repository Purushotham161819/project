const { server } = require("../dependencies");
const Template = require("../models/template");

// API to create a new template
server.post("/createTemplate", async (req, res) => {
  const { templateId, name, fields, status } = req.body;

  // Validate the required fields
  if (!templateId || !name || !Array.isArray(fields)) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Ensure each field has a placeholder for dynamic content
  fields.forEach(field => {
    if (!field.placeholder) {
      field.placeholder = `{{${field.label}}}`; // Default placeholder if not provided
    }
  });

  try {
    // Check if the template ID already exists
    const existingTemplate = await Template.findOne({ templateId });
    if (existingTemplate) {
      return res.status(400).json({ error: "Template ID already exists." });
    }

    // Create the new template with the placeholders
    const newTemplate = new Template({
      templateId,
      name,
      fields,
      status: status || "active",
    });

    // Save the new template
    const template = await newTemplate.save();

    // Return the success response with the template data
    res.status(201).json({
      message: "Template has been created",
      template: template,  // Optionally, return the template data if needed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving template", details: err.message });
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

  // Validate if the fields array is provided and if the placeholder is properly defined
  if (updateData.fields) {
    updateData.fields.forEach((field) => {
      if (!field.placeholder) {
        field.placeholder = `{{${field.label}}}`; // Default placeholder if not provided
      }
    });
  }

  try {
    // Update the template with the given templateId
    const updatedTemplate = await Template.findOneAndUpdate(
      { templateId },
      updateData,
      { new: true, runValidators: true }
    );

    // If template not found, return a 404 error
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Return the updated template data
    res.status(200).json({
      message: "Template updated successfully",
      template: updatedTemplate,
    });
  } catch (err) {
    console.error("Error updating template:", err);
    res.status(500).json({ error: "Error updating template", details: err.message });
  }
});


// API to delete a template by templateId
server.delete("/deleteTemplate/:templateId", async (req, res) => {
  const { templateId } = req.params;

  try {
    // Find and delete the template by templateId
    const deletedTemplate = await Template.findOneAndDelete({ templateId });

    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Send success response
    res.status(200).json({
      message: "Template has been deleted successfully",
      template: deletedTemplate,
    });
  } catch (err) {
    console.error("Error deleting template", err);
    res.status(500).json({ error: "Error deleting template", details: err.message });
  }
});


module.exports = server;
