const express = require('express');
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  upload
} = require('../controllers/product.controller');

// 🔥 RUTA CORRECTA (SIN S)
const auth = require('../middleware/auth.middleware');

// =======================
// PRODUCTOS
// =======================

// LISTAR
router.get('/', auth, getProducts);

// CREAR
router.post('/', auth, upload.single('image'), createProduct);

// ACTUALIZAR
router.put('/:id', auth, upload.single('image'), updateProduct);

// ELIMINAR
router.delete('/:id', auth, deleteProduct);

module.exports = router;