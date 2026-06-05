const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateBody } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', validateBody('register'), AuthController.register);
router.post('/login', validateBody('login'), AuthController.login);
router.post('/change-password', authenticate, validateBody('changePassword'), AuthController.changePassword);

module.exports = router;
