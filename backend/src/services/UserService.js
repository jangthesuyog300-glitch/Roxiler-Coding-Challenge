const UserRepository = require('../repositories/UserRepository');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserService {
  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return user;
  }

  async getAllUsers(filters = {}, limit = 10, offset = 0) {
    const where = {};

    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.email) {
      where.email = { [Op.like]: `%${filters.email}%` };
    }
    if (filters.address) {
      where.address = { [Op.like]: `%${filters.address}%` };
    }
    if (filters.role) {
      where.role = filters.role;
    }

    return await UserRepository.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
  }

  async createUserByAdmin(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      const err = new Error('Email already registered');
      err.status = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return await UserRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async getAdminMetrics() {
    const totalUsers = await UserRepository.count();
    // We can import other repositories inside the functions or service to count.
    // Or we can import them in the constructor/top.
    const StoreRepository = require('../repositories/StoreRepository');
    const RatingRepository = require('../repositories/RatingRepository');

    const totalStores = await StoreRepository.count();
    const totalRatings = await RatingRepository.count();

    return {
      totalUsers,
      totalStores,
      totalRatings
    };
  }
}

module.exports = new UserService();
