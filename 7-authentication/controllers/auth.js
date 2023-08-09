const User = require("../models/user");
const bcrypt = require("bcryptjs");
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')

// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth:{
//     api_key:'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' ,
//   }
// }))

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      bcrypt.hash(password, 12)
      .then((password) => {
        const user = new User({
          email: email,
          password: password,
          cart: { items: [] },
        })
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
        // return transporter.sendMail({
        //   to:email,
        //   from: 'shop@node.com',
        //   subject:'Signup succeeded',
        //   html: '<h1>You succesfully signed up<h1>'
        // })
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
