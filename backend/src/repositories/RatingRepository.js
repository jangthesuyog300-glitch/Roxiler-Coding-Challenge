const { Rating, User, Store } = require('../models');

class RatingRepository {
  async findByUserAndStore(userId, storeId) {
    return await Rating.findOne({
      where: { userId, storeId }
    });
  }

  async create(ratingData) {
    return await Rating.create(ratingData);
  }

  async update(id, ratingValue) {
    const [updatedRowsCount] = await Rating.update(
      { rating: ratingValue },
      { where: { id } }
    );
    return updatedRowsCount > 0;
  }

  async upsert(userId, storeId, ratingValue) {
    const existing = await this.findByUserAndStore(userId, storeId);
    if (existing) {
      existing.rating = ratingValue;
      await existing.save();
      return existing;
    } else {
      return await this.create({ userId, storeId, rating: ratingValue });
    }
  }

  async findRatingsForStoreWithOwner(storeId, limit = 10, offset = 0) {
    const { count, rows } = await Rating.findAndCountAll({
      where: { storeId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }
      ],
      order: [['updatedAt', 'DESC']]
    });
    return { count, rows };
  }

  async getAverageAndCountForStore(storeId) {
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating']
    });
    
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = parseFloat((sum / ratings.length).toFixed(2));
    return { average, count: ratings.length };
  }

  async count(options = {}) {
    return await Rating.count(options);
  }
}

module.exports = new RatingRepository();
