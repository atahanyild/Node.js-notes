const { validationResult } = require("express-validator");
const Post = require("../models/post");

const User = require("../models/user");
const fs = require("fs");
const path = require("path");

const io = require("../socket");

// then catch
exports.getPosts = (req, res, next) => {
  //pagination logic
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "fetched posts succesfuly",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => setError(err));
};

// // async await
// exports.getPosts = async (req, res, next) => {
//   //pagination logic
//   const currentPage = req.query.page || 1;
//   const perPage = 2;
//   let totalItems;
//   try {
//     const count = await Post.find().countDocuments();
//     const posts = await Post.find()
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage);

//     res.status(200).json({
//       message: "fetched posts succesfuly",
//       posts: posts,
//       totalItems: totalItems,
//     });
//   } catch (err) {
//     setError(err);
//   }
// };

exports.postPost = async (req, res, next) => {
  //validation hatası varsa hata ver
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    throw error;
  }

  //post oluştur ve kaydet
  if (!req.file) {
    const error = new Error("no image provided");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const post = new Post({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl: imageUrl,
  });

  try {
    post.save();
    let user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit("posts", { action: "create", post: post });
    res.status(201).json({
      message: "post created succesfuly",
      post: {
        post,
        creator: { _id: creator._id, name: creator.name },
      },
    });
  } catch (err) {
    setError(err);
  }
  //create a post in db
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "post fetched", post: post });
  } catch (err) {
    setError(err);
  }
};

exports.updatePost = (req, res, next) => {
  //validation hatası varsa hata ver
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("no file picked");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("not auth");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      io.getIO().emit("posts", { action: "update", post: result });
      res.status(200).json({ message: "post fetched", post: result });
    })
    .catch((err) => {
      setError(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      //check logged in user
      if (!post) {
        const error = new Error("could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("not auth");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);

      return Post.findByIdAndRemove(post);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      io.getIO().emit("posts", {
        action: "delete",
        post: postId,
      });
      res.status(200).json({ message: "deleted post" });
    })
    .catch((err) => {
      setError(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

const setError = (err) => {
  console.log(err);
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  next(err);
};
