const CombinedModel = require('../models/combined.model');

// Get all combined model entries
exports.getAllFurnitureDetail = async (req, res) => {
  try {
    const entries = await CombinedModel.find();
    if (entries.length === 0) {
      return res.status(404).json({ message: 'No entries found' });
    }
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entries', details: error.message });
  }
};

//get Quotaions by user name 
// Controller Function: Get entries by the 'user' field
exports.getFurnitureDetailByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    // Check if the username is provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required to fetch entries' });
    }

    // Fetch entries for the specified username
    const entries = await CombinedModel.find({ user: username });

    if (entries.length === 0) {
      return res.status(404).json({ message: 'No entries found for the specified user' });
    }

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entries', details: error.message });
  }
};

// Generate last quotation number
exports.getLastQuotationNumber = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const prefix = `Qu-${currentYear}-`;

    const lastQuotation = await CombinedModel.findOne({
      quotationNumber: { $regex: `^${prefix}` }
    }).sort({ quotationNumber: -1 }).exec();

    let newQuotationNumber;
    if (lastQuotation) {
      const lastNumber = parseInt(lastQuotation.quotationNumber.split('-')[2], 10);
      const newNumber = lastNumber + 1;
      newQuotationNumber = `${prefix}${newNumber.toString().padStart(3, '0')}`;
    } else {
      newQuotationNumber = `${prefix}001`;
    }

    res.status(200).json({ newQuotationNumber });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quotation number', details: error.message });
  }
};

// Create a new combined model entry
exports.createCombinedModel = async (req, res) => {
  try {
    if (!req.body.quotationNumber) {
      return res.status(400).json({ error: 'Quotation number is required' });
    }

    const existingEntry = await CombinedModel.findOne({ quotationNumber: req.body.quotationNumber });
    if (existingEntry) {
      return res.status(400).json({ error: 'Quotation number already exists' });
    }

    const newEntry = new CombinedModel(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create entry', details: error.message });
  }
};

// Get a combined model entry by ID
exports.getCombinedModelById = async (req, res) => {
  try {
    const entry = await CombinedModel.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    res.status(500).json({ error: 'Failed to fetch entry', details: error.message });
  }
};

// Update a combined model entry by ID
exports.updateCombinedModelById = async (req, res) => {
  try {
    const updatedEntry = await CombinedModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    res.status(400).json({ error: 'Failed to update entry', details: error.message });
  }
};

// Update only 'items' field in a combined model entry
exports.updateCombinedModelDetails = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }

    const updatedEntry = await CombinedModel.findByIdAndUpdate(
      req.params.id,
      { $set: { items } },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    res.status(400).json({ error: 'Failed to update entry details', details: error.message });
  }
};

// Delete a combined model entry by ID
exports.deleteCombinedModelById = async (req, res) => {
  try {
    const deletedEntry = await CombinedModel.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    res.status(500).json({ error: 'Failed to delete entry', details: error.message });
  }
};
