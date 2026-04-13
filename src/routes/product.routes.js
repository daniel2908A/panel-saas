const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, controller.getProducts);
router.post('/', auth, controller.upload.single('image'), controller.createProduct);
router.put('/:id', auth, controller.upload.single('image'), controller.updateProduct);
router.delete('/:id', auth, controller.deleteProduct);

module.exports = router;