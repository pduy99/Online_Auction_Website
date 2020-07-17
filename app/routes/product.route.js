const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

router.get('/search', productController.search);
router.get('/productdetail/:id', productController.productdetail);
router.get('/product', productController.product);
module.exports = router;