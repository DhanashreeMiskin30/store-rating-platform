const express = require('express');
const ratingController = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticateToken, authorizeRoles(ROLES.NORMAL_USER));

router.post('/', ratingController.submitRating);
router.put('/:storeId', ratingController.updateRating);

module.exports = router;
