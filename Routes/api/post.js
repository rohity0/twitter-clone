const express = require("express");
const Posts = require("../../Model/Post");
const { populate } = require("../../Model/userSchema.");

const posts = express.Router();


posts.get("/", async (req, res)=>{
     try{
         let data =  await  Posts.find().populate("postedBy").sort({"createdAt": -1})
          console.log(data)
         res.status(200).send(data)
           
     }catch(e){
          res.send(e.message)
     } 
})

posts.post("/", async (req, res)=>{
         if(!req.body.content){
            console.log("No Data");
        return res.sendStatus(400)
       } 
      try{
         let postData = req.body.content
        //  console.log(postData)
         let Data = new Posts({
              post : postData, 
              postedBy: req.session.user._id
         });
        
         Data= await Data.save();
         Data =  await Data.populate("postedBy")
        
          res.status(200).send(Data);

      }catch(e){
        console.log(e.message)
      }
           
})

module.exports = posts