const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const auth = require('../controller/middleware/auth'); // Import the auth middleware
const functionsController = require('../controller/functions.controller');
const rateSubmissionController = require('../controller/rateSubmission.controller');
const combinedController = require('../controller/combined.controller');
const userController = require('../controller/user.controller');
const userAuthController = require('../controller/auth/user.auth');

// Rate Materials Endpoints (Protected)
router.get('/rate-materials', auth, rateSubmissionController.getRateMaterials);
router.post('/rate-materials', auth, rateSubmissionController.addRateMaterial);
router.put('/rate-materials/:id', auth, rateSubmissionController.updateRateMaterial);
router.post('/rate-submission', auth, rateSubmissionController.rateSubmission);

// Component Endpoints (Protected)
router.get('/', auth, functionsController.getAllComponents);
router.get('/materials', auth, functionsController.getAllMaterials);
router.get('/:id', auth, functionsController.getComponentById);
router.post('/', auth, functionsController.createComponent);
router.put('/:id', auth, functionsController.updateComponentById);
router.delete('/:id', auth, functionsController.deleteComponentById);
router.post('/addmultipleMaterials', auth, functionsController.addMultipleMaterials);

// Authentication Endpoints (Public)
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  userController.register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  userController.login
);

// User Management Endpoints (Protected)
router.get('/user/alluser', auth, userAuthController.getAllUsers);
router.delete('/user/:id', auth, userAuthController.deleteUser);
router.put('/user/:id', auth, userAuthController.updateUser);

// Combined Model Endpoints (Protected)
router.get('/combine/getFurnitureDetailByUsername', auth, combinedController.getFurnitureDetailByUsername);
router.get('/combined/getAllFurniture-Detail', auth, combinedController.getAllFurnitureDetail);
router.get('/combined/lastQuotationNumber', combinedController.getLastQuotationNumber);
router.post('/combined', auth, combinedController.createCombinedModel);
router.get('/combined/:id', auth, combinedController.getCombinedModelById);
router.put('/combined/:id', auth, combinedController.updateCombinedModelById);
router.put('/combined-details/:id', auth, combinedController.updateCombinedModelDetails);
router.delete('/combined/:id', auth, combinedController.deleteCombinedModelById);

module.exports = router;
