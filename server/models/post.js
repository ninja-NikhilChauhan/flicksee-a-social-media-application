const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: true,
  },
  body: {
    type: "string",
    required: true,
  },
  photo: {
    type: "string",
    required: true,
  },
  comments:[{
    text: String,
    postedby: { type: ObjectId, ref: "User" },
  }],
  likes: [{ type: ObjectId, ref: "User" }],
  postedby: {
    type: ObjectId,
    ref: "User",
  },
},{timestamps:true});

mongoose.model("Post", postSchema);
