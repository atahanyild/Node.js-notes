const path = require('path');

const express = require('express');

const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products' , productsController.getProducts)

router.get('/products/:productId' , productsController.getProduct)

router.get('/cart' , productsController.getCart)

router.post('/add-to-cart/:productId', productsController.postCart)

router.post('/delete-from-cart/:productId', productsController.postDeleteFromCart)

router.get('/orders' , productsController.getOrders)

// router.get('/checkout')


module.exports = router;
