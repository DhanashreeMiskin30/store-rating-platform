function sendSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}

function sendError(res, statusCode, message, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
