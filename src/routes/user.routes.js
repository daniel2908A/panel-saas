const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.get('/users', authMiddleware, adminMiddleware, getUsers);

module.exports = router;