const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');


// 🔐 LOGIN
router.post('/login', authController.login);


// 📝 REGISTRO (opcional)
router.post('/register', authController.register);


module.exports = router;