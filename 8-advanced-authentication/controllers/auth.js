const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto');
const user = require("../models/user");
const { reset } = require("nodemon");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:'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' ,
  }
}))

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
        return transporter.sendMail({
          to:email,
          from: 'atahan03@hotmail.com',
          subject:'Signup succeeded',
          html: '<h1>You succesfully signed up<h1>'
        })
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

exports.getReset = (req,res,next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset",
  });
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32, (err,buffer) => {
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')
    User.findOne({email:req.body.email})
    .then(user => {
      if(!user){
        console.log('no account found')
        return res.redirect('/reset');
      }

      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000
      return user.save()
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to:user.email,
          from: 'atahan03@hotmail.com',
          subject:'Password Reset',
          html: `
          <p>You requested reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset it</p>
          `
        })
      })
    })
    .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "new password",
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => console.log(err))
}

exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser
  User.findOne({resetToken: passwordToken,resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user => {
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword
    resetUser.resetToken= undefined
    resetUser.resetTokenExpiration = undefined
    return resetUser.save()
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(err=>console.log(err))
}