const RatingRepository = require('../repositories/RatingRepository');
const StoreRepository = require('../repositories/StoreRepository');

class RatingService {
  async submitRating(userId, storeId, ratingValue) {
    // 1. Verify store exists
    const store = await StoreRepository.findById(storeId);
    if (!store) {
      const err = new Error('Store not found');
      err.status = 404;
      throw err;
    }

    // 2. Rating value validation
    if (ratingValue < 1 || ratingValue > 5) {
      const err = new Error('Rating must be between 1 and 5');
      err.status = 400;
      throw err;
    }

    // 3. Submit or update rating
    return await RatingRepository.upsert(userId, storeId, ratingValue);
  }
}

module.exports = new RatingService();
