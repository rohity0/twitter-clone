const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connect = ()=>{
    return mongoose.connect("mongodb+srv://rohity0:rohity0@cluster0.mhfht97.mongodb.net/Twitter").catch(e=>{
        console.log(e.message)
    })
};


module.exports = connect;
