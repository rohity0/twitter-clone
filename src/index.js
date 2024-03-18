const express = require("express");
const { requireLogin } = require("../middleware");
const login = require("../Routes/LoginRoutes");
const path = require("path");
const register = require("../Routes/registerRoutes");
const app = express();
const bodyParser = require("body-parser");
const connect = require("../config/db");
const session = require("express-session");
const logout = require("../Routes/logout");
const posts = require("../Routes/api/post");
const postRoutes = require("../Routes/postRoutes");
const profileRoutes = require("../Routes/pofileRoutes");
const users = require("../Routes/api/users");
const uploadImages = require("../Routes/uploadRoutes");


const PORT = process.env.PORT || 8000;

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(
  session({
    secret: "rohityadav",
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/login", login);
app.use("/register", register);
app.use("/logout", logout);
app.use("/posts", requireLogin, postRoutes);
app.use("/profile", requireLogin, profileRoutes);
app.use("/uploads", uploadImages);

app.get("/", requireLogin, (req, res) => {
  var paylaod = {
    title: "Twitter",
    userName: req.session.user,
    userNameJS: JSON.stringify(req.session.user),
  };
  res.status(200).render("home", paylaod);
});

// api
app.use("/api/posts", posts);
app.use("/api/users", users);


app.listen(PORT, async () => {
  await connect();
  console.log("started at 8000");
});
