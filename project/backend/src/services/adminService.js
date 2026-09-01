const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');
const { ROLES } = require('../config/constants');
const {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateRole
} = require('../utils/validators');
const { SALT_ROUNDS } = require('./authService');

async function getDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    userModel.countUsers(),
    storeModel.countStores(),
    ratingModel.countRatings()
  ]);
  return { totalUsers, totalStores, totalRatings };
}

async function createUserByAdmin({ name, email, password, address, role }) {
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const addressErr = validateAddress(address);
  const passwordErr = validatePassword(password);
  const roleErr = validateRole(role, Object.values(ROLES));
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (addressErr) errors.address = addressErr;
  if (passwordErr) errors.password = passwordErr;
  if (roleErr) errors.role = roleErr;

  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  const existing = await userModel.findByEmail(email.trim().toLowerCase());
  if (existing) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userModel.createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    address: address ? address.trim() : null,
    role
  });

  return userModel.findById(userId);
}

async function createStoreByAdmin({ name, email, address, ownerId }) {
  if (!name || name.trim().length === 0) {
    throw new ApiError(400, 'Store name is required', { name: 'Store name is required' });
  }
  const emailErr = email ? validateEmail(email) : null;
  const addressErr = validateAddress(address);
  const errors = {};
  if (emailErr) errors.email = emailErr;
  if (addressErr) errors.address = addressErr;
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  if (ownerId) {
    const owner = await userModel.findById(ownerId);
    if (!owner) {
      throw new ApiError(400, 'Selected store owner does not exist', { ownerId: 'Owner not found' });
    }
    if (owner.role !== ROLES.STORE_OWNER) {
      throw new ApiError(400, 'Selected user is not a store owner', { ownerId: 'User is not a STORE_OWNER' });
    }
  }

  const storeId = await storeModel.createStore({
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : null,
    address: address ? address.trim() : null,
    ownerId: ownerId || null
  });

  return storeModel.findById(storeId);
}

async function listUsers(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  const { rows, total } = await userModel.listUsers({
    name: query.name,
    email: query.email,
    address: query.address,
    role: query.role,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    page,
    limit
  });

  return {
    users: rows,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) }
  };
}

async function getUserDetails(id) {
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const result = { ...user };
  if (user.role === ROLES.STORE_OWNER) {
    const store = await storeModel.findByOwnerId(user.id);
    if (store) {
      const summary = await storeModel.getStoreWithRatingSummary(store.id);
      result.store = {
        id: store.id,
        name: store.name,
        averageRating: summary ? Number(summary.average_rating).toFixed(1) : '0.0'
      };
    }
  }
  return result;
}

async function listStores(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  const { rows, total } = await storeModel.listStores({
    name: query.name,
    email: query.email,
    address: query.address,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    page,
    limit
  });

  const stores = rows.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    ownerId: s.owner_id,
    averageRating: Number(s.average_rating) > 0 ? Number(s.average_rating).toFixed(1) : 'Not Rated',
    ratingCount: s.rating_count
  }));

  return {
    stores,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) }
  };
}

module.exports = {
  getDashboardStats,
  createUserByAdmin,
  createStoreByAdmin,
  listUsers,
  getUserDetails,
  listStores
};
