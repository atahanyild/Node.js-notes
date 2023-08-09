const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        editing: false,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    Product.fetchById(req.params.productId, product => {
        console.log(req.params.productId)
        res.render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(updatedTitle,updatedImageUrl,updatedPrice,updatedDesc,productId)
    updatedProduct.save()
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId
    Product.deleteById(prodId)
    res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

