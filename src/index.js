const express = require("express");
const { requireLogin } = require("../middleware");
const login = require("../Routes/LoginRoutes");
const path = require("path");
const register = require("../Routes/registerRoutes");
const app = express();
const bodyParser  = require("body-parser");
const connect = require("../config/db");
const session = require('express-session')

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));
app.use(session({
    secret : "rohityadav",
    resave : true,
    saveUninitialized: false,                                             
}))


app.use("/login", login);
app.use("/register", register);

app.get("/", requireLogin, (req,res)=>{
      var paylaod = {
          title : "Twitter",
        //   userName : req.session, 
      }
       res.status(200).render("home", paylaod)
})



app.listen(8000, async ()=>{
    await connect();
  console.log("started at 8000")
})
