const express = require("express");
const Posts = require("../../Model/Post");
const User = require("../../Model/userSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const users = express.Router();

users.put("/:userId/follow", async (req, res, next) => {
  let userId = req.params.userId;
  let user = await User.findById(userId);

  if (user === null) return res.sendStatus(400);
  let isFollowing =
    user.followers && user.followers.includes(req.session.user._id);
  let option = isFollowing ? "$pull" : "$addToSet";
  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    { [option]: { following: userId } },
    { new: true }
  ).catch((e) => {
    res.send(e.message);
  });

  User.findByIdAndUpdate(userId, {
    [option]: { followers: req.session.user._id },
  }).catch((e) => {
    res.send(e.message);
  });

  res.status(200).send(req.session.user);
});

users.get("/:userId/following", (req, res) => {
       User.findById(req.params.userId)
        .populate("following")
       .then((result) => {
        res.status(200).send(result);
       })
    .catch((error) => {
        res.send(400);
       });
});

users.get("/:userId/followers", (req, res) => {
  User.findById(req.params.userId)
   .populate("followers")
  .then((result) => {
   res.status(200).send(result);
  })
    .catch((error) => {
   res.send(400);
  });
});

users.get("/:userId/followers", (req, res) => {
  User.findById(req.params.userId)
    .populate("followers")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.send(400);
    });
});

users.post(
  "/profilePicture",
  upload.single("croppedImage"),
  async (req, res, next) => {
    if (!req.file) {
      return res.sendStatus(400);
    }
    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`);
    fs.rename(tempPath, targetPath, async (err) => {
      if (err !== null) {
        console.log(err);
        return res.sendStatus(400);
      }
      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { profile: filePath },
        { new: true }
      );
      res.sendStatus(204);
    });
  }
);

module.exports = users;
