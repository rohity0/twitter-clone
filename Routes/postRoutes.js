const express = require("express");
const users = require("../Model/userSchema");
const app = express();
const postRoutes  = express.Router();
const bcrypt = require("bcrypt");



postRoutes.get("/:id", (req, res)=>{

    var paylaod = {
        title : "View Post",
        userName : req.session.user,
        userNameJS : JSON.stringify(req.session.user), 
        postId: req.params.id
    }
    res.status(200).render("postPage", paylaod)
})


module.exports = postRoutes;
