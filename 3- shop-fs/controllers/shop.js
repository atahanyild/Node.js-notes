const Product = require('../models/product');
const Cart = require('../models/cart')
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'products',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId
  Product.fetchById(id, product => {
    res.render('shop/product-detail', {
      product: product,
      path: "/products",
      pageTitle: "Product Details",
    })
  })
  // res.redirect('/')
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'index',
      path: '/'
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
  Product.fetchAll(products => {
    const cartProducts = [];
    for (product of products) {
      const cartProductData = cart.products.find(
        prod => prod.id === product.id
      );
      if (cartProductData) {
        cartProducts.push({ productData: product, qty: cartProductData.qty });
      }
    }
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  })})
};

exports.postCart = (req, res, next) => {
  const productId = req.params.productId
  Product.fetchById(productId, product => {
    Cart.addProduct(productId, product.price)
  })
  res.redirect('/')
}

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.params.productId
  Product.fetchById(productId, product => {
    Cart.deleteItem(productId, product.price)
  })
  res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Orders'
  })
}

