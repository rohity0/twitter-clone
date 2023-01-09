const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    post : {type:String, trim:  true },
    postedBy : {type: mongoose.Schema.Types.ObjectId,  ref:"user", },
    pinned: {type: Boolean , default: false},
    likes : [{type: mongoose.Schema.Types.ObjectId,  ref:"user", }]
}, {timestamps: true} );

const Posts = mongoose.model("post", postSchema);


module.exports = Posts