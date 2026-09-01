const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticateToken, authorizeRoles(ROLES.SYSTEM_ADMIN));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetails);
router.post('/stores', adminController.createStore);
router.get('/stores', adminController.listStores);

module.exports = router;
