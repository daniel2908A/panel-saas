const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// 📦 CREAR PRODUCTO (ADMIN + SUPER RESELLER)
router.post(
  '/',
  auth,
  requireRole('admin', 'super_reseller'),
  productController.createProduct
);

// 📦 LISTAR PRODUCTOS (PRIVADO)
router.get('/', auth, productController.getProducts);

// 🔓 PRODUCTOS PÚBLICOS
router.get('/public', productController.getProductsPublic);

// 🔍 OBTENER UNO
router.get('/:id', auth, productController.getProductById);

// ✏️ EDITAR PRODUCTO (ADMIN + SUPER RESELLER)
router.put(
  '/:id',
  auth,
  requireRole('admin', 'super_reseller'),
  productController.updateProduct
);

// ❌ ELIMINAR PRODUCTO (ADMIN + SUPER RESELLER)
router.delete(
  '/:id',
  auth,
  requireRole('admin', 'super_reseller'),
  productController.deleteProduct
);

module.exports = router;