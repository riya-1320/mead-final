const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RateSubmissionSchema = new Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientCode: {
    type: String,
    required: true,
  },
  components: [
    {
      materialType: String,
      rows: [
        {
          componentName: String,
          uom: String,
          rate: Number,
          size: String,
        },
      ],
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RateSubmission', RateSubmissionSchema);