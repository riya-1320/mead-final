const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  itemSelect: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  components: [
    {
      unit: {
        type: String,
      },
      componentName: {
        type: String,
      },
      length: {
        type: Number,
      },
      breadth: {
        type: Number,
      },
      depth: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      cutsize: {
        type: Number
      },
      materials: [
        {
          material: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
  bo : [
    {
      materialname: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      cutsize: {
        type: Number,
      },
      materials: [
        {
          material: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
});

const CombinedSchema = new Schema({
  // Fields from RateSubmissionSchema
  quotationNumber: { type: String, required: true, unique: true },
  user : { type: String, required: true },
  clientName: {
    type: String
  },
  clientCode: {
    type: String
  },
  materials: [
    {
      materialType: String,
      rows: [
        {
          materialName: String,
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
  items: [ItemSchema],
  totalAmount: {
    type: Number
  },
});

module.exports = mongoose.model('CombinedModel', CombinedSchema);
