const monooge = require("mongoose");

const userSchema = new monooge.Schema({
      firstName : {type: String, required:true},
      lastName : {type: String , required:true},
      email : {type: String , required:true, unique: true},
      password : {type: String , required: true},
      userName  : {type: String , required:true, unique: true},
      profile:  {type: String , default: ""}
}, {timestamps: true})

const users = monooge.model("user",  userSchema);

module.exports = users;
