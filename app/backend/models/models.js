var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:String,
  key:[{
    date:String,
    session:[{
      startTime:String,
      endTime:String,
      queries:[{
        result:[{
          label:String,
          propbability:Number
        }],
        modelUrl:String,
        cometUrl:String,
        query:String
      }]
    }]
  }]
});

var userModel = mongoose.model('users', userSchema );

module.exports={
    userModel,
}