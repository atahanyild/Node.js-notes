const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(t, iU, p, d, id) {
    this.title = t;
    this.imageUrl = iU
    this.price = p
    this.description = d
    this.id = id
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => 
          p.id === this.id
        )
        console.log('index',existingProductIndex)
        console.log('tihs' , this)
        const updatedProducts = [...products]
        console.log('abc' , updatedProducts[existingProductIndex])
        updatedProducts[existingProductIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString()
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }

    })
  }

  static deleteById(id){
    getProductsFromFile(products => {
      const productIndex = products.findIndex(p => p.id === id)
      products.splice(productIndex,1)
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    });
  }
};
