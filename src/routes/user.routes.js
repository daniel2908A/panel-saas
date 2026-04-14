const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user.controller');

// 🔥 SIN middleware por ahora (para probar)
router.get('/', getUsers);

module.exports = router;