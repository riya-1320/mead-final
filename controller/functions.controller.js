const FurnitureDetail = require('../models/furniterDetail.model');
const itemMasterModel = require('../models/itemMaster.model');

// Utility function to handle errors
const handleError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ error: true, message });
};

// Controller to get all components
const getAllComponents = async (req, res) => {
  try {
    const components = await FurnitureDetail.find();
    if (!components.length) {
      return handleError(res, 'No components found', 404);
    }
    res.status(200).json({ success: true, data: components });
  } catch (err) {
    handleError(res, `Server error: ${err.message}`);
  }
};

// Controller to get all materials
const getAllMaterials = async (req, res) => {
    console.log("Fetching all materials");
    try {
        const materials = await itemMasterModel.find();
        if (!materials.length) {
            return handleError(res, 'No materials found', 404);
        }
        res.status(200).json({ success: true, data: materials });
    } catch (err) {
        handleError(res, `Server error: ${err.message}`);
    }
};

// Controller to get a specific component by ID
const getComponentById = async (req, res) => {
  const { id } = req.params;
  if (!id) return handleError(res, 'Component ID is required', 400);

  try {
    const component = await FurnitureDetail.findById(id);
    if (!component) {
      return handleError(res, 'Component not found', 404);
    }
    res.status(200).json({ success: true, data: component });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, 'Invalid component ID', 400);
    }
    handleError(res, `Server error: ${err.message}`);
  }
};

// Controller to create a new component
const createComponent = async (req, res) => {
    const { clientName, clientCode, itemSelect, components } = req.body;

    if (  !itemSelect || !components) {
        return handleError(res, 'Missing required fields', 400);
    }

    const newComponent = new FurnitureDetail({
        
        itemSelect,
        components
    });

    try {
        const savedComponent = await newComponent.save();
        res.status(201).json({ success: true, message: 'Component created successfully', data: savedComponent });
    } catch (err) {
        handleError(res, `Failed to create component: ${err.message}`, 400);
    }
};

// Controller to update a component by ID
const updateComponentById = async (req, res) => {
  const { id } = req.params;
  const { clientName, clientCode, itemSelect, components } = req.body;

  if (!id) return handleError(res, 'Component ID is required', 400);

  try {
    const updatedComponent = await FurnitureDetail.findByIdAndUpdate(
      id,
      { clientName, clientCode, itemSelect, components },
      { new: true, runValidators: true }
    );

    if (!updatedComponent) {
      return handleError(res, 'Component not found', 404);
    }

    res.status(200).json({ success: true, message: 'Component updated successfully', data: updatedComponent });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, 'Invalid component ID', 400);
    }
    handleError(res, `Failed to update component: ${err.message}`, 400);
  }
};

// Controller to delete a component by ID
const deleteComponentById = async (req, res) => {
  const { id } = req.params;

  if (!id) return handleError(res, 'Component ID is required', 400);

  try {
    const deletedComponent = await FurnitureDetail.findByIdAndDelete(id);

    if (!deletedComponent) {
      return handleError(res, 'Component not found', 404);
    }

    res.status(200).json({ success: true, message: 'Component deleted successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return handleError(res, 'Invalid component ID', 400);
    }
    handleError(res, `Failed to delete component: ${err.message}`);
  }
};

// Controller to add a new material
const addMaterial = async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return handleError(res, 'Material name is required', 400);
    }

    try {
        const newMaterial = new itemMasterModel({ name });
        await newMaterial.save();
        res.status(201).json({ success: true, message: 'Material added successfully', data: newMaterial });
    } catch (err) {
        handleError(res, `Failed to add material: ${err.message}`);
    }
};

// Controller to add multiple materials
const addMultipleMaterials = async (req, res) => {
    const { materials } = req.body;

    if (!Array.isArray(materials) || materials.length === 0) {
        return handleError(res, 'Materials should be a non-empty array', 400);
    }

    try {
        const newMaterials = materials.map(materialName => ({ name: materialName }));
        const savedMaterials = await itemMasterModel.insertMany(newMaterials);
        res.status(201).json({ success: true, message: 'Materials added successfully', data: savedMaterials });
    } catch (err) {
        handleError(res, `Failed to add materials: ${err.message}`);
    }
};

module.exports = {
  getAllComponents,
  getAllMaterials,
  getComponentById,
  createComponent,
  updateComponentById,
  deleteComponentById,
  addMaterial,
  addMultipleMaterials
};
