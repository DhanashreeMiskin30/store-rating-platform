const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');

/**
 * Verifies the JWT sent in the Authorization header and attaches the
 * authenticated user (without password hash) to req.user.
 * Every protected route must use this - the frontend role check is
 * never trusted on its own.
 */
const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication token missing or malformed');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await userModel.findById(payload.id);
  if (!user) {
    throw new ApiError(401, 'User account no longer exists');
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to one or more roles. Must run after authenticateToken.
 */
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};

module.exports = { authenticateToken, authorizeRoles };
