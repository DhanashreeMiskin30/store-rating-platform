const ApiError = require('../utils/ApiError');
const ratingModel = require('../models/ratingModel');
const storeModel = require('../models/storeModel');
const { validateRating } = require('../utils/validators');

async function submitRating(userId, { storeId, rating }) {
  if (!storeId) {
    throw new ApiError(400, 'storeId is required');
  }
  const ratingErr = validateRating(rating);
  if (ratingErr) {
    throw new ApiError(400, ratingErr);
  }

  const store = await storeModel.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  const existing = await ratingModel.findByUserAndStore(userId, storeId);
  if (existing) {
    throw new ApiError(409, 'You have already rated this store. Use update instead.');
  }

  await ratingModel.createRating({ userId, storeId, rating: Number(rating) });
}

async function updateRating(userId, storeId, { rating }) {
  const ratingErr = validateRating(rating);
  if (ratingErr) {
    throw new ApiError(400, ratingErr);
  }

  const store = await storeModel.findById(storeId);
  if (!store) {
    throw new ApiError(404, 'Store not found');
  }

  const existing = await ratingModel.findByUserAndStore(userId, storeId);
  if (!existing) {
    throw new ApiError(404, 'You have not rated this store yet');
  }

  await ratingModel.updateRating({ userId, storeId, rating: Number(rating) });
}

module.exports = { submitRating, updateRating };
