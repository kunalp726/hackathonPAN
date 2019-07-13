var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  name:String,
});

var userModel = mongoose.model('users', userSchema );

module.exports={
    userModel,
}