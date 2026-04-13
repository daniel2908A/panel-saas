const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

const auth = require('../middleware/auth.middleware');

// 📦 CREAR PRODUCTO (SIN BLOQUEO POR ROLE)
router.post(
  '/',
  auth,
  productController.createProduct
);

// 📦 LISTAR PRODUCTOS
router.get('/', auth, productController.getProducts);

// 🔓 PÚBLICOS
router.get('/public', productController.getProductsPublic);

// 🔍 UNO
router.get('/:id', auth, productController.getProductById);

// ✏️ EDITAR
router.put('/:id', auth, productController.updateProduct);

// ❌ ELIMINAR
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;