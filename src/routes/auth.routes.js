const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller'); // <-- destructuring correcto

router.post('/login', login);

module.exports = router;