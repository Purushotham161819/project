const mongoose = require('mongoose');

// Define the Template schema
const templateSchema = new mongoose.Schema({
  templateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fields: [
    {
      label: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, required: true },
      placeholder: { type: String, required: false }
    }
  ],
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
