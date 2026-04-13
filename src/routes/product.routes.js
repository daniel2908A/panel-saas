const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// 📦 CREAR PRODUCTO (ADMIN + SUPER RESELLER)
router.post(
  '/',
  auth,
  requireRole(['admin', 'super_reseller']), // ✅ CORRECTO
  productController.createProduct
);

// 📦 LISTAR PRODUCTOS
router.get('/', auth, productController.getProducts);

// 🔓 PÚBLICOS
router.get('/public', productController.getProductsPublic);

// 🔍 UNO
router.get('/:id', auth, productController.getProductById);

// ✏️ EDITAR
router.put(
  '/:id',
  auth,
  requireRole(['admin', 'super_reseller']), // ✅ CORRECTO
  productController.updateProduct
);

// ❌ ELIMINAR
router.delete(
  '/:id',
  auth,
  requireRole(['admin', 'super_reseller']), // ✅ CORRECTO
  productController.deleteProduct
);

module.exports = router;