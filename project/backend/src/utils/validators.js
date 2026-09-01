const { VALIDATION } = require('../config/constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Name is required';
  }
  const len = name.trim().length;
  if (len < VALIDATION.NAME_MIN || len > VALIDATION.NAME_MAX) {
    return `Name must be between ${VALIDATION.NAME_MIN} and ${VALIDATION.NAME_MAX} characters`;
  }
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Email format is invalid';
  }
  return null;
}

function validateAddress(address) {
  if (address === undefined || address === null || address === '') return null;
  if (typeof address !== 'string') return 'Address must be text';
  if (address.length > VALIDATION.ADDRESS_MAX) {
    return `Address must not exceed ${VALIDATION.ADDRESS_MAX} characters`;
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < VALIDATION.PASSWORD_MIN || password.length > VALIDATION.PASSWORD_MAX) {
    return `Password must be between ${VALIDATION.PASSWORD_MIN} and ${VALIDATION.PASSWORD_MAX} characters`;
  }
  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!PASSWORD_SPECIAL_REGEX.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
}

function validateRole(role, validRoles) {
  if (!role || !validRoles.includes(role)) {
    return `Role must be one of: ${validRoles.join(', ')}`;
  }
  return null;
}

function validateRating(rating) {
  const num = Number(rating);
  if (!Number.isInteger(num)) {
    return 'Rating must be an integer';
  }
  if (num < 1 || num > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
}

module.exports = {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateRole,
  validateRating
};
