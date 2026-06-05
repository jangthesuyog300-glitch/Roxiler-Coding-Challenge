const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password, address } = req.body;
      const user = await AuthService.register({
        name,
        email,
        password,
        address,
        role: 'user' // Registrations default to 'user'
      });
      res.status(201).json({
        message: 'Registration successful',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      res.status(200).json({
        message: 'Login successful',
        token: data.token,
        user: data.user
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      await AuthService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
