const express = require("express");
const users = require("../Model/userSchema.");
const app = express();
const profileRoutes = express.Router();
const bcrypt = require("bcrypt");

profileRoutes.get("/", (req, res) => {
  var paylaod = {
    title: req.session.user.userName,
    userName: req.session.user,
    userNameJS: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render("profilePage", paylaod);
});

profileRoutes.get("/:username", async (req, res, next) => {
  var paylaod = await getPayload(req.params.username, req.session.user);
  res.status(200).render("profilePage", paylaod);
});

profileRoutes.get("/:username/replies", async (req, res, next) => {
  var paylaod = await getPayload(req.params.username, req.session.user);
  paylaod.selectedTab = "replies"
  res.status(200).render("profilePage", paylaod);
});

async function getPayload(userName, userLoggedIn) {
  let user = await users.findOne({ userName: userName });
  if (user == null) {
    user = await users.findById(userName);
    if (user == null) {
      return {
        title: "User not found",
        userName: userLoggedIn,
        userNameJS: JSON.stringify(userLoggedIn),
      };
    }
  }

  return {
    title: user.userName,
    userName: userLoggedIn,
    userNameJS: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
}

module.exports = profileRoutes;
