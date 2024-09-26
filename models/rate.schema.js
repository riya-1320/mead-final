const mongoose = require('mongoose');

// Define the schema for Rate
const rateSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  rates: {
    type: Map,
    of: Number, // Map of rates for material options
    default: {}, // Default to an empty map
  },
});

// Create and export the model for Rate
const Rate = mongoose.model('Rate', rateSchema);
module.exports = Rate;
