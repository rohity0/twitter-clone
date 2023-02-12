const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    post : {type:String, trim:  true },
    postedBy : {type: mongoose.Schema.Types.ObjectId,  ref:"user", },
    pinned: {type: Boolean , default: false},
    likes : [{type: mongoose.Schema.Types.ObjectId,  ref:"user", }],
    retweet : [{type: mongoose.Schema.Types.ObjectId,  ref:"user", }],
    retweetData : {type: mongoose.Schema.Types.ObjectId,  ref:"post", },
    replyTo : {type: mongoose.Schema.Types.ObjectId,  ref:"post", },
}, {timestamps: true} );

const Posts = mongoose.model("post", postSchema);


module.exports = Posts