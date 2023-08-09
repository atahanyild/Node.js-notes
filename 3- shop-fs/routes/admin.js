const path = require('path');

const express = require('express');

const productsController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

router.get('/edit-product/:productId', productsController.getEditProduct);

router.post('/edit-product/', productsController.postEditProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

router.post("/delete-product" , productsController.postDeleteProduct);

router.get('/products' , productsController.getProducts)
module.exports = router;
