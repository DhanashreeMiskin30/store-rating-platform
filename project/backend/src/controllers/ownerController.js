const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ownerService = require('../services/ownerService');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await ownerService.getDashboard(req.user.id);
  return sendSuccess(res, 200, 'Owner dashboard', data);
});

const getRatings = asyncHandler(async (req, res) => {
  const raters = await ownerService.getRatingsList(req.user.id);
  return sendSuccess(res, 200, 'Ratings for your store', { raters });
});

module.exports = { getDashboard, getRatings };
