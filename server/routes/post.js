const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requirelogin = require("../middleware/requirelogin");

router.get("/allpost", requirelogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name username pic")
    .populate("comments.postedby", "_id name username pic")
    .sort('-createdAt')
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/allsubscribedpost",requirelogin, (req, res) => {
  // console.log("User following IDs:", req.user.following);
  Post.find({postedby:{$in:req.user.following}})
    .populate("postedby", "_id name username pic")
    .populate("comments.postedby", "_id name username")
    .sort('-createdAt')
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/mypost", requirelogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .populate("comments.postedby", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    });
});
router.post("/createpost", requirelogin, (req, res) => {
  const { title, body, pic } = req.body;
  // console.log(title,body,pic)
  if (!title || !body || !pic) {
    res.status(422).json({ error: "please add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedby: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.delete('/deletepost/:postId', requirelogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedby", "_id")
    .then((post) => {
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }
      if (post.postedby._id.toString() === req.user._id.toString()) {
        Post.deleteOne({ _id: req.params.postId })
          .then(result => {
            Post.find()
              .populate("postedby", "_id name")
              .then(posts => {
                res.json({ posts });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({ error: "Error fetching posts" });
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error deleting post" });
          });
      } else {
        res.status(403).json({ error: "You are not authorized to delete this post" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error finding post" });
    });
});

router.put("/like", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate("postedby", "_id name username pic")
    .populate("comments.postedby", "_id name username pic")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Error liking post:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.put("/unlike", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate("postedby", "_id name username pic")
    .populate("comments.postedby", "_id name username pic")
    .then((result) => {
      
      res.json(result);
    })
    .catch((err) => {
      console.error("Error unliking post:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});
// router.get("/getComments",(req,res)=>{
//   Post.find().populate("comments","postedBy ").then((comments)=>{
//     res.json(comments)
//   }).catch(err=>{
//     console.log(err)
//   })
// })
router.put("/comments", requirelogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedby: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedby", "_id name username pic")
    .populate("postedby", "_id name username pic")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Error liking post:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
