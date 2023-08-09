const express = require("express");

const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body(
      "password",
      "enter a password with only numbers and text and atleast 5 characters"
    )
      .isLength({ min: 3 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("this email is forbidden");
        // }
        // return true
        return User.findOne({ email: req.body.email }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email exists already");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "enter a password with only numbers and text and atleast 5 characters"
    )
      .isLength({ min: 3 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords have to match");
      }
      return true;
    })
    .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);
module.exports = router;
