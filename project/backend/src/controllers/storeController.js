const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const storeService = require('../services/storeService');
const storeModel = require('../models/storeModel');
const ApiError = require('../utils/ApiError');

const listStores = asyncHandler(async (req, res) => {
  const result = await storeService.listStoresForUser(req.query, req.user.id);
  return sendSuccess(res, 200, 'Stores retrieved', result);
});

const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeModel.getStoreWithRatingSummary(req.params.id);
  if (!store) throw new ApiError(404, 'Store not found');
  return sendSuccess(res, 200, 'Store retrieved', {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: Number(store.average_rating) > 0 ? Number(store.average_rating).toFixed(1) : 'Not Rated',
      ratingCount: store.rating_count
    }
  });
});

module.exports = { listStores, getStoreById };
