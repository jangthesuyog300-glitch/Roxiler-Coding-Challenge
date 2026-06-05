const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { validateBody } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Get owner dashboard stats (Store Owner only)
router.get('/owner/dashboard', authenticate, authorize('store_owner'), StoreController.getOwnerDashboard);

// Create new store (Admin only)
router.post('/', authenticate, authorize('admin'), validateBody('createStore'), StoreController.createStore);

// Get list of stores with overall and user ratings (Normal User and Admin)
router.get('/', authenticate, authorize('admin', 'user'), StoreController.getStores);

module.exports = router;
