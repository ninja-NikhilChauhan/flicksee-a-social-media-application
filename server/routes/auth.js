const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require('crypto')
const Jwt = require("jsonwebtoken");
const { JWTTOKENS } = require("../config/key");
const Hash = require("bcryptjs");
const requirelogin = require("../middleware/requirelogin");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'leaf.madebywe@gmail.com',
    pass: 'nezk kvtc mdcc mpvn'
  }
});

router.get("/protected", requirelogin, (req, res) => {
  res.send("hello there");
});
router.post("/signup", (req, res) => {
  const { name, email, password, username } = req.body;
  if (!email || !password || !name || !username) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  User.findOne({ $or: [{ username: username }, { email: email }] })
    .then((saveduser) => {
      if (saveduser) {
        return res.status(422).json({ error: "user already exist" });
      }
      Hash.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          username,
        });
        user
          .save()
          .then((saved) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post('/resetpassword',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
    }
const token = buffer.toString('hex')
User.findOne({email:req.body.email}).then(user=>{
  if(!user){
    return res.status(422).json({error:'user does not exist!'})
  }
  user.resetToken=token;
  user.expireToken=Date.now() + 1800000
  user.save().then(result=>{
    transporter.sendMail({
      to:user.email,
      from:'no-reply@flicksee.com',
      subject:'password reset',
      html:`
      <p>You requested for password reset</p>
      <h4>click on this <a href='http://localhost:3000/resetpassword/${token}'>link</a> to reset the password</h4>
      `
    })
    res.json({message:'Please check your email to reset your password!'})
  })
})
  })
})
router.post('/newpassword',(req,res)=>{
  const token = req.body.token;
  const newpassword=req.body.password;
  User.findOne({resetToken:token,expireToken:{$gt:Date.now()}}).then(user=>{
    if(!user){
      return res.status(422).json({error:'Try again session has expired!'})
  }
  Hash.hash(newpassword, 12).then((hashedpassword) => {
    user.password=hashedpassword;
    user.resetToken=undefined;
    user.expireToken=undefined;
    user.save().then(result=>{
      res.json({message:'password updated successfully!'})
    })
  })
  }).catch(err=>console.log(err))

})
router.post("/setimage", requirelogin, (req, res) => {
  const { pic } = req.body;
  if (!pic) {
    return res.status(422).json({ error: "please provide a image" });
  }
  User.findOne({ _id: req.user._id }).then((saveduser) => {
    if (saveduser) {
      saveduser.pic = pic;
      saveduser.save().then((saveduser) => {
        res.json(
          saveduser
        );
      });
    }
  });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((saved) => {
    if (!saved) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    Hash.compare(password, saved.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = Jwt.sign({ _id: saved._id }, JWTTOKENS);
          const { _id, name, email, followers, following, pic,username } = saved;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic ,username},
          });
        } else {
          return res.status(422).json({ error: "invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//hackhazards

module.exports = router;
