const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  "mongodb+srv://atahanyild:03atahan42@cluster0.vp4igzj.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        next()
      }
      req.user = user;
      next();
    })
    .catch(err => {next(new Error(err))});
});

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// bir error fırlatıldığında ( next(error) ) 
//diğer middlewareleri geçip buna geliyor
app.use((error,req,res,next) => {
  res.redirect('/500')
})

mongoose
  .connect(MONGODB_URI,{ useNewUrlParser: true , useUnifiedTopology: true})
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


//npm i bcryptjs connect-mongodb-session csurf ejs express express-session express-validator mongodb mongoose nodemailer nodemailer-sendgrid-transport 