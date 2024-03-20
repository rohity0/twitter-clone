const monooge = require("mongoose");

const userSchema = new monooge.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    profile: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    coverPhoto: {
      type: String,
    },
    likes: [{ type: monooge.Schema.Types.ObjectId, ref: "post" }],
    retweet: [{ type: monooge.Schema.Types.ObjectId, ref: "post" }],
    following: [{ type: monooge.Schema.Types.ObjectId, ref: "user" }],
    followers: [{ type: monooge.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const users = monooge.model("user", userSchema);

module.exports = users;
