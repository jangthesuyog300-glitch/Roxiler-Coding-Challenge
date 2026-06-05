const { User } = require('../models');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async findByIdWithPassword(id) {
    return await User.findByPk(id);
  }

  async create(userData) {
    const user = await User.create(userData);
    const result = user.toJSON();
    delete result.password;
    return result;
  }

  async findAll(options = {}) {
    return await User.findAll({
      ...options,
      attributes: { exclude: ['password'] }
    });
  }

  async findAndCountAll(options = {}) {
    const { count, rows } = await User.findAndCountAll({
      ...options,
      attributes: { exclude: ['password'] }
    });
    return { count, rows };
  }

  async update(id, updates) {
    const [updatedRowsCount] = await User.update(updates, {
      where: { id }
    });
    return updatedRowsCount > 0;
  }

  async count(options = {}) {
    return await User.count(options);
  }
}

module.exports = new UserRepository();
