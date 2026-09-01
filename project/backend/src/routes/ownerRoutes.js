const express = require('express');
const ownerController = require('../controllers/ownerController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticateToken, authorizeRoles(ROLES.STORE_OWNER));

router.get('/dashboard', ownerController.getDashboard);
router.get('/ratings', ownerController.getRatings);

module.exports = router;
