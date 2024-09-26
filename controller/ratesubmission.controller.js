const Material = require("../models/marterialType.model");
const rateSubmissionModel = require("../models/rateSubmission.model");

// Get all materials
const getRateMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        if (!materials.length) {
            return res.status(404).json({ message: 'No materials found' });
        }
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'Internal server error while fetching materials' });
    }
};

// Add a new material or merge options if material exists
const addRateMaterial = async (req, res) => {
  const { material_type, options } = req.body;

  // Check if required fields are provided
  if (!material_type || !options || Object.keys(options).length === 0) {
    return res.status(400).json({ message: 'Material type and options are required' });
  }

  try {
    // Check if material type already exists
    const existingMaterial = await Material.findOne({ material_type });

    if (existingMaterial) {
      console.log('Existing options before merge:', existingMaterial.options);

      // Merge new options into existing ones
      existingMaterial.options = {
        ...existingMaterial.options,
        ...options
      };

      console.log('Options after merge:', existingMaterial.options);

      // Save the updated material
      const updatedMaterial = await existingMaterial.save();
      return res.status(200).json(updatedMaterial);
    } else {
      // Create a new material if it doesn't exist
      const material = new Material({ material_type, options });

      const newMaterial = await material.save();
      return res.status(201).json(newMaterial);
    }
  } catch (error) {
    console.error('Error saving material:', error.message);
    res.status(500).json({ message: 'Error saving material to the database' });
  }
};

// Update material options, rate, or uom
const updateRateMaterial = async (req, res) => {
    const { materialType } = req.params;
    const { option, rate, uom } = req.body;

    // Check if required fields are provided
    if (!materialType || !option || !rate || !uom) {
        return res.status(400).json({ message: 'Material type, option, rate, and UOM are required' });
    }

    try {
        const material = await Material.findOne({ material_type: materialType });
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Update the specific option
        material.options.set(option, { rate, uom });

        const updatedMaterial = await material.save();
        res.status(200).json(updatedMaterial);
    } catch (error) {
        console.error('Error updating material:', error.message);
        res.status(500).json({ message: 'Internal server error while updating material' });
    }
};

// Handle rate submissions
const rateSubmission = async (req, res) => {
    const { clientName, clientCode, components } = req.body;
  
    // Validate request data
    if (!clientName || !clientCode || !components || !components.length) {
        return res.status(400).json({ message: 'Client name, client code, and components are required' });
    }
  
    try {
        const newSubmission = new rateSubmissionModel({
            clientName,
            clientCode,
            components,
        });

        const savedSubmission = await newSubmission.save();
  
        res.status(201).json({ message: 'Form submitted successfully!', data: savedSubmission });
    } catch (error) {
        console.error('Error saving submission:', error.message);
        res.status(500).json({ message: 'Internal server error while saving submission' });
    }
};

// Get all rate submissions
const getRateSubmission = async (req, res) => {
    try {
        const submissions = await rateSubmissionModel.find();
        if (!submissions.length) {
            return res.status(404).json({ message: 'No submissions found' });
        }
        res.status(200).json({ submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error.message);
        res.status(500).json({ message: 'Internal server error while fetching submissions' });
    }
};

module.exports = { rateSubmission, getRateSubmission, addRateMaterial, getRateMaterials, updateRateMaterial };
