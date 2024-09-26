const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_type: { type: String, required: true },
    options: {
        type: Object,
        of: new mongoose.Schema({
            rate: { type: Number, required: true },
            uom: { type: String, required: true },
            qty: { type: Number }
        })
    }
});


const Material = mongoose.model('RateMaterial', materialSchema);

module.exports = Material;
