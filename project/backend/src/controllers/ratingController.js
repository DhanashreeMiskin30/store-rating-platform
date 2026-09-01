const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ratingService = require('../services/ratingService');

const submitRating = asyncHandler(async (req, res) => {
  await ratingService.submitRating(req.user.id, req.body);
  return sendSuccess(res, 201, 'Rating submitted successfully');
});

const updateRating = asyncHandler(async (req, res) => {
  await ratingService.updateRating(req.user.id, req.params.storeId, req.body);
  return sendSuccess(res, 200, 'Rating updated successfully');
});

module.exports = { submitRating, updateRating };
