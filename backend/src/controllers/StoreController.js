const StoreService = require('../services/StoreService');

class StoreController {
  async createStore(req, res, next) {
    try {
      const { name, email, address, ownerId } = req.body;
      const store = await StoreService.createStore({
        name,
        email,
        address,
        ownerId
      });
      res.status(201).json({
        message: 'Store created successfully',
        store
      });
    } catch (error) {
      next(error);
    }
  }

  async getStores(req, res, next) {
    try {
      const { search, limit = 10, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const userId = req.user ? req.user.id : null;

      const { count, rows } = await StoreService.getAllStores(userId, search, limit, offset);

      res.status(200).json({
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        stores: rows
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerDashboard(req, res, next) {
    try {
      const ownerId = req.user.id;
      const { limit = 10, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const dashboardData = await StoreService.getOwnerDashboard(ownerId, limit, offset);
      res.status(200).json(dashboardData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();
