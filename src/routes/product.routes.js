const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// 📦 CREAR PRODUCTO
router.post(
  '/',
  auth,
  requireRole('admin'),
  productController.createProduct
);

// 📦 LISTAR PRODUCTOS (PRIVADO)
router.get('/', auth, productController.getProducts);

// 🔓 PRODUCTOS PÚBLICOS (SIN LOGIN) 🔥
router.get('/public', productController.getProductsPublic);

// 🔍 OBTENER UNO
router.get('/:id', auth, productController.getProductById);

// ✏️ EDITAR PRODUCTO
router.put(
  '/:id',
  auth,
  requireRole('admin'),
  productController.updateProduct
);

// ❌ ELIMINAR PRODUCTO
router.delete(
  '/:id',
  auth,
  requireRole('admin'),
  productController.deleteProduct
);

module.exports = router;