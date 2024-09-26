const mongoose = require('mongoose');

const FurnitureDetailSchema = new mongoose.Schema({
     
    itemSelect: { type: String, required: true },
    components: [{
        unit: { type: String, required: true },
        componentName: { type: String, required: true },
        length: { type: Number, required: true },
        breadth: { type: Number, required: true },
        depth: { type: Number, required: true },
        quantity: { type: Number, required: true },
        materials: [{
            material: { type: String, required: true },
            value: { type: String, required: true }
        }]
    }]
});

const FurnitureDetail = mongoose.model('FurnitureDetail', FurnitureDetailSchema);
module.exports = FurnitureDetail;
