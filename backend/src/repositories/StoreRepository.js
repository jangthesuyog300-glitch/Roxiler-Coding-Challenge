const { Store, User, Rating } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

class StoreRepository {
  async findById(id) {
    return await Store.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async findByOwnerId(ownerId) {
    return await Store.findOne({
      where: { ownerId }
    });
  }

  async create(storeData) {
    return await Store.create(storeData);
  }

  async findAndCountAllWithRatings(userId = null, search = '', limit = 10, offset = 0) {
    const escapedUserId = userId ? sequelize.escape(userId) : 'NULL';
    
    // Subqueries for calculating overall rating and user's rating
    const overallRatingSql = `(
      SELECT COALESCE(AVG(rating), 0)
      FROM ratings
      WHERE ratings.store_id = Store.id
    )`;
    
    const userRatingSql = `(
      SELECT rating
      FROM ratings
      WHERE ratings.store_id = Store.id AND ratings.user_id = ${escapedUserId}
    )`;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Store.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        include: [
          [sequelize.literal(overallRatingSql), 'overallRating'],
          [sequelize.literal(userRatingSql), 'userRating']
        ]
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ],
      order: [['name', 'ASC']]
    });

    // Format numbers
    const formattedRows = rows.map(row => {
      const json = row.toJSON();
      json.overallRating = parseFloat(parseFloat(json.overallRating).toFixed(2));
      json.userRating = json.userRating ? parseInt(json.userRating) : null;
      return json;
    });

    return { count, rows: formattedRows };
  }

  async count(options = {}) {
    return await Store.count(options);
  }
}

module.exports = new StoreRepository();
