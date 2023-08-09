const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

//image upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = Date.now();
    cb(null, name + file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   if (
//     file.minetype === "image/png" ||
//     file.minetype === "image/jpg" ||
//     file.minetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else{
//   cb(null, false);
//   }
// };

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

//farklı serverlardan ulaşmak için header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

//error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  const data = error.data;
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://atahanyild:03atahan42@cluster0.vp4igzj.mongodb.net/messages"
  )
  .then((result) => {
app.listen(8080)
  })
  .catch((err) => console.log(err));
