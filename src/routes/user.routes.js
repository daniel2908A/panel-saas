const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/users', authMiddleware, adminMiddleware, getUsers);

module.exports = router;