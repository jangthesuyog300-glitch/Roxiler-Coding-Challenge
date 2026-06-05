const StoreRepository = require('../repositories/StoreRepository');
const UserRepository = require('../repositories/UserRepository');
const RatingRepository = require('../repositories/RatingRepository');

class StoreService {
  async createStore(storeData) {
    // 1. Verify owner exists and has 'store_owner' role
    const owner = await UserRepository.findById(storeData.ownerId);
    if (!owner) {
      const err = new Error('Store owner user not found');
      err.status = 404;
      throw err;
    }
    
    // We should get user details with role. Wait, UserRepository.findById excludes password but includes role
    const ownerUser = await UserRepository.findByIdWithPassword(storeData.ownerId);
    if (ownerUser.role !== 'store_owner') {
      const err = new Error('Specified user is not a store owner');
      err.status = 400;
      throw err;
    }

    // 2. Check if owner already owns a store
    const existingStore = await StoreRepository.findByOwnerId(storeData.ownerId);
    if (existingStore) {
      const err = new Error('This store owner already manages an existing store');
      err.status = 400;
      throw err;
    }

    // 3. Create store
    return await StoreRepository.create(storeData);
  }

  async getAllStores(userId = null, search = '', limit = 10, offset = 0) {
    return await StoreRepository.findAndCountAllWithRatings(userId, search, limit, offset);
  }

  async getStoreByOwner(ownerId) {
    const store = await StoreRepository.findByOwnerId(ownerId);
    if (!store) {
      const err = new Error('No store found for this store owner');
      err.status = 404;
      throw err;
    }
    return store;
  }

  async getOwnerDashboard(ownerId, limit = 10, offset = 0) {
    const store = await this.getStoreByOwner(ownerId);
    
    // Get average rating and counts
    const { average, count } = await RatingRepository.getAverageAndCountForStore(store.id);
    
    // Get list of ratings with user details
    const { count: ratingsCount, rows: ratings } = await RatingRepository.findRatingsForStoreWithOwner(
      store.id,
      limit,
      offset
    );

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: average,
      totalRatings: count,
      ratings: ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        updatedAt: r.updatedAt,
        user: r.user
      })),
      totalRatingsCount: ratingsCount
    };
  }
}

module.exports = new StoreService();
