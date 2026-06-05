const UserService = require('../services/UserService');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { name, email, address, role, limit = 10, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const filters = { name, email, address, role };
      
      // Clean undefined filters
      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const { count, rows } = await UserService.getAllUsers(filters, limit, offset);
      
      res.status(200).json({
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        users: rows
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { name, email, password, address, role } = req.body;
      const user = await UserService.createUserByAdmin({
        name,
        email,
        password,
        address,
        role
      });
      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminMetrics(req, res, next) {
    try {
      const metrics = await UserService.getAdminMetrics();
      res.status(200).json({ metrics });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
