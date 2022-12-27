const express = require("express");
const app = express();
const register  = express.Router();
const bodyParser  = require("body-parser");
const users = require("../Model/userSchema.");
const  brcypt = require("bcrypt");
app.set("view engine", "pug");
app.set("views", "views");
// app.use(bodyParser.urlencoded({extended: false}));

register.get("/", (req, res)=>{
    //  console.log(req.body)
    res.status(200).render("register")
})



register.post("/", async (req, res)=>{
     let firstName = req.body.firstName.trim();
     let lastName = req.body.lastName.trim();
     let userName = req.body.userName.trim();
     let email = req.body.email.trim();
     let password = req.body.password;
      let payload  =  req.body

    if(firstName && lastName && userName && email && password){
           try{
            let newData = await users.findOne({$or : [{email: email}, {userName:userName}]});
            if(newData){
               payload.errorM = "User is already Exists"
               res.status(200).render("register", payload )

            }else{
                let data = req.body
                data.password = await brcypt.hash(password, 10)
                let user = new users(data);
                 await user.save();
                  req.session.user = user;   
               return  res.redirect("/")
            }
                 

           }catch(e){
               payload.errorM = e.message
            res.status(200).render("register", payload )
           }           
    }else{
         payload.errorM = "Make Sure each has valid value"
        res.status(200).render("register", payload )   
    }

   
})
module.exports = register;
