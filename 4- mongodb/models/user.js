const getDb = require('../util/database').getDb
const mongodb = require('mongodb')
const Product = require('./product')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart //{ items: []}
    this._id = id
  }

  save() {
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(i => i.productId)

    return db.collection('products')
      .find({ _id: { $in: productIds } }).toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p, qty: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString()
            }).qty
          }
        })
      })
  }



  deleteCartItemById(prodId) {
    const db = getDb()
    const updatedCartItems = [...this.cart.items]

    const deleteIndex = updatedCartItems.findIndex(i => {
      return i.productId.toString() === prodId.toString()
    })
    // console.log(deleteIndex)
    if (this.cart.items[deleteIndex].qty === 1) {
      updatedCartItems.splice(deleteIndex, 1)
    }
    else {
      updatedCartItems[deleteIndex].qty -= 1
    }

    const updatedCart = { items: updatedCartItems }

    return db.collection('users')
      .updateOne({ _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } })
      // .then(result => { console.log('delOne', result) })
      .catch(err => { console.log(err) })
  }

  addOrder() {
    const db = getDb()
    return this.getCart()
    .then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name,
        }
      }
      return db.collection('orders').insertOne(order)})
    .then(result => {
        this.cart = { items: [] }
        return db.collection('users')
          .updateOne({ _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: this.cart } })
      })
  }

  getOrders( ){
    const db = getDb()
    return db.collection('orders')
    .find({'user._id': new mongodb.ObjectId(this._id)}).toArray()
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    const db = getDb()

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].qty + 1
      updatedCartItems[cartProductIndex].qty = newQuantity
    } else {
      updatedCartItems.push(
        {
          productId: new mongodb.ObjectId(product._id),
          qty: newQuantity
        })
    }

    const updatedCart = { items: updatedCartItems }

    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } })
      // .then(result => { console.log('upone', result) })
      .catch(err => { console.log(err) })
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
      .catch(err => { console.log(err) })
  }
}

module.exports = User;
