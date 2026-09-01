const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return sendSuccess(res, 201, 'Registration successful. You can now log in.', { user });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  return sendSuccess(res, 200, 'Login successful', { token, user });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  return sendSuccess(res, 200, 'Password updated successfully');
});

const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Current user', { user: req.user });
});

module.exports = { register, login, changePassword, me };
