const express = require("express");
const Posts = require("../../Model/Post");
const User = require("../../Model/userSchema");
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

users.get("/:userId/following", (req, res)=> {
       User.findById(req.params.userId)
        .populate("following")
       .then(result=> {
        res.status(200).send(result)
       }).catch(error=> {
        res.send(400)
       })
})

users.get("/:userId/followers", (req, res)=> {
  User.findById(req.params.userId)
   .populate("followers")
  .then(result=> {
   res.status(200).send(result)
  }).catch(error=> {
   res.send(400)
  })
})

module.exports = users;
