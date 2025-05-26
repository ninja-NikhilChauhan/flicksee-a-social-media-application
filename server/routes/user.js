const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requirelogin = require("../middleware/requirelogin");
const User = mongoose.model("User");

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedby: req.params.id })
        .populate("postedby", "_id name")
        .then((posts) => {
          res.json({ user, posts });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});

router.put("/follow", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
  .then((result) => {
    if (!result) {
      return res.status(404).json({ error: "User to follow not found" });
    }
    return User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    ).select("-password");
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    return res.status(422).json({ error: err.message });
  });
});
router.post("/search-user",(req,res)=>{
  let userPattern =new RegExp("^"+req.body.query)
  User.find({username:{$regex:userPattern}}).select("_id  pic username")
  .then(user=>[
    res.json({user:user})
  ]).catch(err=>console.log(err))
})
router.put("/unfollow", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
  .then((result) => {
    if (!result) {
      // If the user to unfollow was not found, send a 404 response
      return res.status(404).json({ error: "User to unfollow not found" });
    }
    // Update the current user's following list
    return User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");
  })
  .then((result) => {
    // Send the result of the current user's updated following list
    return res.json(result);
  })
  .catch((err) => {
    // Handle any errors that occurred during the process
    res.status(422).json({ error: err.message });
  });
});

// router.put("/unfollow", requirelogin, (req, res) => {
//   User.findByIdAndUpdate(
//     req.body.unfollowId,
//     {
//       $pull: { followers: req.user._id },
//     },
//     {
//       new: true,
//     }
//   )
//     .then((err, result) => {
//       if (err) {
//         return res.status(422).json({ error: err });
//       }
//       User.findByIdAndUpdate(req.user._id, {
//         $pull: { following: req.body.unfollowId },
//       });
//       return res.json(result);
//     })
//     .catch((err) => {
//       return res.json(err);
//     });
// });

module.exports = router;
