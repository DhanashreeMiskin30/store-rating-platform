const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userModel = require('../models/userModel');
const { ROLES } = require('../config/constants');
const {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword
} = require('../utils/validators');

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...rest } = user;
  return rest;
}

async function register({ name, email, address, password }) {
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const addressErr = validateAddress(address);
  const passwordErr = validatePassword(password);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (addressErr) errors.address = addressErr;
  if (passwordErr) errors.password = passwordErr;

  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  const existing = await userModel.findByEmail(email.trim().toLowerCase());
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userModel.createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    address: address ? address.trim() : null,
    role: ROLES.NORMAL_USER
  });

  const user = await userModel.findById(userId);
  return user;
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await userModel.findByEmail(email.trim().toLowerCase());
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
}

async function changePassword(userId, { currentPassword, newPassword, confirmNewPassword }) {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError(400, 'All password fields are required');
  }
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, 'New password and confirmation do not match');
  }
  const passwordErr = validatePassword(newPassword);
  if (passwordErr) {
    throw new ApiError(400, passwordErr);
  }

  const user = await userModel.findByIdWithPassword(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePassword(userId, newHash);
}

module.exports = { register, login, changePassword, sanitizeUser, SALT_ROUNDS };
