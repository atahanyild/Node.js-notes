const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://atahanyild:03atahan42@cluster0.vp4igzj.mongodb.net/?retryWrites=true&w=majority')
  .then(client => {
    console.log('connected')
    _db = client.db('test')
    callback(client)
  })
  .catch(err =>{
    console.log(err)
    throw err
  })
}

const getDb = () => {
  if(_db){return _db}
  throw 'no database found'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb