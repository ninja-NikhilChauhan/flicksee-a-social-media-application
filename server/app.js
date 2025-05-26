
const express = require("express");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/key");
const app = express();
const PORT = process.env.PORT || 5000
app.get("/", (req, res) => {
  res.send("hello world");
})



app.listen(PORT, () => {
mongoose.connect("mongodb://nikhilchauhan9813:NKkxFZiK3icza5Rl@ac-re91cpi-shard-00-00.kyzh84p.mongodb.net:27017,ac-re91cpi-shard-00-01.kyzh84p.mongodb.net:27017,ac-re91cpi-shard-00-02.kyzh84p.mongodb.net:27017/?ssl=true&replicaSet=atlas-c4kxob-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0");
mongoose.connection.on("connected", () => {
  console.log("connection is on...all good");
});
mongoose.connection.on("error", (err) => {
  console.log("error is occured in mongodb",err);
});
  console.log(`server is running  on ${PORT}`);
});
require("./models/user");
require("./models/post");
// require(".models/channels")
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// app.use(require("./routes/auth"))?
// Ul0GW9md6mACfJgg

// if(process.env.NODE_ENV==="production"){
//   app.use(express.static(path.join(__dirname, "..", "client", "build")))
//   const path= require('path')
//   app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'..','client','build','index.html'))
//   })
// }

