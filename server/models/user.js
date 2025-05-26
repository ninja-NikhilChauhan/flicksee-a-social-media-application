const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  resetToken:"string",
  expireToken:"Date",
  pic:{
type:"string",
default:"https://res.cloudinary.com/dpsvrdlmt/image/upload/v1716791095/profile_f6qcu8.png"
  },
  followers:[{ type: ObjectId, ref: "User" }],
  following:[
    {
      type:ObjectId,
      ref:'User'
    }
  ]
});

mongoose.model("User", userSchema)