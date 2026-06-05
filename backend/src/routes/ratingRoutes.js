const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/RatingController');
const { validateBody } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Normal Users only can submit/update ratings
router.post('/', authenticate, authorize('user'), validateBody('submitRating'), RatingController.submitRating);

module.exports = router;
