const mongoose = require('mongoose');

// Define the schema for UOM
const uomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  uom: {
    type: String, // General UOM for the type
    required: true,
  },
  specificOptions: {
    type: Map,
    of: String, // Map of specific options for UOM
    default: {}, // Default to an empty map
  },
});

// Create and export the model for UOM
const UOM = mongoose.model('rateUOM', uomSchema);
module.exports = UOM;
