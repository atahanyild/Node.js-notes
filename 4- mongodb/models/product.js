const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
  constructor(title, price, description, imageUrl, id,userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id
    this.userId = userId
  }

  save() {
    const db = getDb()
    if (this._id) {
      db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      db.collection('products').insertOne(this)
    }
  }

 

  static destroyById(prodId) {
    const db = getDb()
    db.collection('products')
    .deleteOne({ _id: new mongodb.ObjectId(prodId)})
    .then(products => {
      // console.log('destroyed')
      return products
    })
    .catch(err => {
      console.log(err)
    })

  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        // console.log(products)
        return products
      })
      .catch(err => {
        console.log(err)
      })
  }

  static fetchById(prodId) {
    const db = getDb()
    console.log(prodId)
    return db.collection('products')
      .findOne({ _id: new mongodb.ObjectId(prodId) })
      .then(product => {
        // console.log(product.title)
        return product
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = Product;
