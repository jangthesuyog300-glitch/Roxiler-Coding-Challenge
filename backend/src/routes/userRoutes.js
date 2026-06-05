const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateBody } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Accessible by any authenticated user
router.get('/profile', authenticate, UserController.getProfile);

// Admin only routes
router.get('/', authenticate, authorize('admin'), UserController.getUsers);
router.get('/metrics', authenticate, authorize('admin'), UserController.getAdminMetrics);
router.post('/', authenticate, authorize('admin'), validateBody('adminCreateUser'), UserController.createUser);
router.get('/:id', authenticate, authorize('admin'), UserController.getUserById);

module.exports = router;
