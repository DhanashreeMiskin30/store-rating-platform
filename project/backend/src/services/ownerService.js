const ApiError = require('../utils/ApiError');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

async function getOwnStore(ownerId) {
  const store = await storeModel.findByOwnerId(ownerId);
  if (!store) {
    throw new ApiError(404, 'No store is associated with your account yet');
  }
  return store;
}

async function getDashboard(ownerId) {
  const store = await getOwnStore(ownerId);
  const summary = await storeModel.getStoreWithRatingSummary(store.id);
  const ratings = await ratingModel.listRatingsForStore(store.id);

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address
    },
    averageRating: summary ? Number(summary.average_rating).toFixed(1) : '0.0',
    totalRatings: summary ? summary.rating_count : 0,
    raters: ratings.map((r) => ({
      userId: r.user_id,
      name: r.user_name,
      email: r.user_email,
      rating: r.rating,
      ratedAt: r.created_at
    }))
  };
}

async function getRatingsList(ownerId) {
  const store = await getOwnStore(ownerId);
  const ratings = await ratingModel.listRatingsForStore(store.id);
  return ratings.map((r) => ({
    userId: r.user_id,
    name: r.user_name,
    email: r.user_email,
    rating: r.rating,
    ratedAt: r.created_at
  }));
}

module.exports = { getDashboard, getRatingsList };
