const express = require("express");
const Posts = require("../../Model/Post");

const posts = express.Router();


posts.get("/", (req, res)=>{

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