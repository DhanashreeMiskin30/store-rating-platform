const express = require('express');
const storeController = require('../controllers/storeController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Any authenticated user can browse stores.
router.get('/', authenticateToken, storeController.listStores);
router.get('/:id', authenticateToken, storeController.getStoreById);

module.exports = router;
