const express = require("express");
const app = express();
const logout  = express.Router();



logout.get("/", (req, res)=>{
     if(req.session){
        req.session.destroy(()=>{
            res.redirect("/login")
        })

     }
})



module.exports = logout;
