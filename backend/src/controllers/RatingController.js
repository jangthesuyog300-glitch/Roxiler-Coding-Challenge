const RatingService = require('../services/RatingService');

class RatingController {
  async submitRating(req, res, next) {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;

      const userRating = await RatingService.submitRating(userId, storeId, rating);
      res.status(200).json({
        message: 'Rating submitted successfully',
        rating: userRating
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
