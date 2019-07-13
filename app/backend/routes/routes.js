let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// var mongoDB = '';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
// var {userModel}=require("../models/models");

var express = require("express");
var router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Routes work!" });
  // let result=await userModel.findOne({_id}).populate({path:'courses',populate:{path:"uid",select:"name"}}).exec();
});

module.exports = router;
