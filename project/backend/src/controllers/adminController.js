const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const adminService = require('../services/adminService');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return sendSuccess(res, 200, 'Dashboard statistics', stats);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUserByAdmin(req.body);
  return sendSuccess(res, 201, 'User created successfully', { user });
});

const createStore = asyncHandler(async (req, res) => {
  const store = await adminService.createStoreByAdmin(req.body);
  return sendSuccess(res, 201, 'Store created successfully', { store });
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  return sendSuccess(res, 200, 'Users retrieved', result);
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await adminService.getUserDetails(req.params.id);
  return sendSuccess(res, 200, 'User details', { user });
});

const listStores = asyncHandler(async (req, res) => {
  const result = await adminService.listStores(req.query);
  return sendSuccess(res, 200, 'Stores retrieved', result);
});

module.exports = { getDashboard, createUser, createStore, listUsers, getUserDetails, listStores };
