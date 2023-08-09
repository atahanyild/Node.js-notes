const fs = require('fs')
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], balance: 0 }
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === id)
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct
            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty += 1
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = { id: id, qty: 1 }
                cart.products = [...cart.products, updatedProduct]
            }
            // const price = parseFloat(parseFloat(productPrice).toFixed(2));
            // cart.balance = parseFloat((cart.balance + price).toFixed(2));
            cart.balance = cart.balance + +productPrice
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err))

        })
    }

    static deleteItem(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], balance: 0 }
            if (!err) {
                cart = JSON.parse(fileContent)
            }

            const productIndex = cart.products.findIndex(p =>
                p.id === id
            )

            console.log(productIndex)
            if (cart.products[productIndex].qty === 1) {
                cart.products.splice(productIndex, 1)
                cart.balance = cart.balance - -productPrice
            } else if (cart.products[productIndex].qty > 1) {
                cart.products[productIndex].qty -= 1
                cart.balance = cart.balance - -productPrice
            }
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err))

        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}