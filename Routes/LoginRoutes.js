const express = require("express");
const users = require("../Model/userSchema");
const app = express();
const login  = express.Router();
const bcrypt = require("bcrypt");

app.set("view engine", "pug");
app.set("views", "views");

login.get("/", (req, res)=>{
    res.status(200).render("login")
})

login.post("/", async (req, res)=>{
    let payload  =  req.body
      if(req.body.loginUser && req.body.logPassword){
                    try{

                        
                        let newData = await users.findOne({$or : [{email:payload.loginUser}, {userName:payload.loginUser}]});
                      
                        if(newData){
                           let result = await bcrypt.compare(req.body.logPassword, newData.password);
                                  if(result){
                                    req.session.user = newData
                                    return res.redirect("/")
                          }}


                        payload.errorM = "Wrong Credntials"
                        res.status(200).render("login", payload )

                    }   catch(e){
                        payload.errorM = e.message
                        res.status(200).render("login", payload )
                        return
                    } 
      }

      payload.errorM = "Not Valid Entry"
      res.status(200).render("login", payload )

})

module.exports = login;
