const express = require("express");
const Posts = require("../../Model/Post");
const users = require("../../Model/userSchema");
// const { populate } = require("../../Model/userSchema.");

const posts = express.Router();

posts.get("/", async (req, res) => {
  try {
    let searchObject = req.query;
    if (searchObject.isReply !== undefined) {
      let isReply = searchObject.isReply == "true";
      searchObject.replyTo = { $exists: isReply };
      delete searchObject.isReply;
    }
    if (searchObject.followingOnly !== undefined) {
      let followingOnly = searchObject.followingOnly == "true";
      if (followingOnly) {
        let objectIds = req.session.user.following;
        objectIds.push(req.session.user._id);
        searchObject.postedBy = { $in: objectIds };
      }
      delete searchObject.followingOnly;
    }
    let data = await getPostData(searchObject);
    res.status(200).send(data);
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

posts.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let postData = await Posts.findOne({ _id: id })
      .populate("postedBy")
      .populate("retweetData")
      .populate({
        path: "retweetData",
        populate: {
          path: "postedBy",
        },
      })
      .populate({
        path: "replyTo",
        populate: {
          path: "postedBy",
        },
      })
      .sort({ createdAt: -1 });

    let result = {
      postData: postData,
    };

    if (postData.replyTo !== undefined) {
      result.replyTo = postData.replyTo;
    }

    result.replies = await getPostData({ replyTo: id });

    res.status(200).send(result);
  } catch (e) {
    {
      res.send(e.message);
    }
  }
});

const getPostData = async (filter) => {
  let result = await Posts.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .catch((error) => console.log(error));

  result = await users.populate(result, { path: "replyTo.postedBy" });
  return await users.populate(result, { path: "retweetData.postedBy" });
};

posts.post("/", async (req, res) => {
  if (!req.body.content) {
    return res.sendStatus(400);
  }
  try {
    let postData = {
      post: req.body.content,
      postedBy: req.session.user._id,
    };
    if (req.body.replyTo) {
      postData.replyTo = req.body.replyTo;
    }

    if (postData.replyTo) {
      let Data = new Posts(postData);
      Data = await Data.save();
      Data = await Data.populate("postedBy");
      res.status(200).send(Data);
    } else {
      let Data = new Posts(postData);
      Data = await Data.save();
      Data = await Data.populate("postedBy");

      res.status(200).send(Data);
    }
  } catch (e) {
    console.log(e.message);
  }
});

posts.put("/:id/like", async (req, res) => {
  let id = req.params.id;
  let userid = req.session.user._id;
  let isLiked = req.session.user.likes && req.session.user.likes.includes(id);

  let option = isLiked ? "$pull" : "$addToSet";

  req.session.user = await users
    .findByIdAndUpdate(userid, { [option]: { likes: id } }, { new: true })
    .catch((e) => {
      res.send(e.message);
    });

  let post = await Posts.findByIdAndUpdate(
    id,
    { [option]: { likes: userid } },
    { new: true }
  ).catch((e) => {
    res.send(e.message);
  });

  res.send(post);
});

posts.post("/:id/retweet", async (req, res) => {
  let id = req.params.id;
  let userid = req.session.user._id;

  let deletePost = await Posts.findOneAndDelete({
    postedBy: userid,
    retweetData: id,
  }).catch((e) => {
    res.send(e.message);
  });

  let option = deletePost !== null ? "$pull" : "$addToSet";

  let repost = deletePost;

  if (repost === null) {
    repost = await Posts.create({ postedBy: userid, retweetData: id }).catch(
      (e) => {
        res.send(e.message);
      }
    );
  }

  req.session.user = await users
    .findByIdAndUpdate(
      userid,
      { [option]: { retweet: repost._id } },
      { new: true }
    )
    .catch((e) => {
      res.send(e.message);
    });

  let post = await Posts.findByIdAndUpdate(
    id,
    { [option]: { retweet: userid } },
    { new: true }
  ).catch((e) => {
    res.send(e.message);
  });

  res.send(post);
});

posts.delete("/:id", async (req, res) => {
  let id = req.params.id;
  Posts.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(202);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    });
});

posts.put("/:id", async (req, res) => {
  if (req.body.pinned !== undefined) {
    await Posts.updateMany(
      { postedBy: req.session.user._id },
      { pinned: false }
    ).catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
  }

  Posts.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.sendStatus(202);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    });
});

module.exports = posts;
