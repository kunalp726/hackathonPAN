let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var mongoDB = "mongodb://localhost:27017/hackathon";
mongoose.connect(mongoDB, { useNewUrlParser: true });
var { userModel } = require("./models/models");

let sessionMap = {};

const commandMap = {
  help: help,
  hi: help,
  "view deployed models": viewDeployedModels,
  "select model": selectModel,
  "view model stats": viewModelStats,
  "view previous session": viewPrevSession,
  "retrain model": retrainModel,
  predict: predict,
  update: update,
  "end session": endSession,
  predictExec: predictExec
};
function predictExec(fileName, name) {
  let data = sessionMap[name];
  //make apicall and get result
  let queryData={
      query:fileName,
      result:[],
      modelUrl:"",
      cometUrl:""
  }
  data.queries.push(queryData);
  return JSON.stringify(sessionMap[name]);
}
function predict(name) {
  startSession(name);
  return "prediction started";
}
async function endSession(name) {
  let data = sessionMap[name];
  delete sessionMap[name];
  data.endSession = new Date().toISOString();

  let user = await userModel.findOne({ name });
  if (user) {
    let res = await userModel.findOne({
      name,
      "key.date": new Date().toLocaleDateString()
    });
    if (res) {
        console.log("user and date found");
      let senderResult = await userModel.updateOne(
        {
          name,
          key: {
            $elemMatch: {
              date: new Date().toLocaleDateString()
            }
          }
        },
        {
          $push: {
            "key.$.session": data
          }
        }
      );
      console.log(senderResult);
    } else {
      let res3 = await userModel.findByIdAndUpdate(
        { name },
        {
          $push: {
            key: {
              date: new Date().toLocaleDateString(),
              session: [{ ...data }]
            }
          }
        }
      );
    }
  } else {
    let newUser = new userModel({
      name,
      key: [
        {
          date: new Date().toLocaleDateString(),
          session: [{ ...data }]
        }
      ]
    });
    let res = await newUser.save();
    return res._id;
  }
}
function startSession(name) {
  if (!sessionMap[name]) {
    sessionMap[name] = {
      startSession: new Date().toISOString(),
      queries: []
    };
  }
}
function update() {
  return "update called!";
}
function viewDeployedModels() {
  return "select model <modelname> \n1. Model 1: Network APPID Classifier \n 2.Model 2 : some other model";
}
function selectModel(modelName) {
  return `select model is ${modelName}
1.view model stats
2.view previous session
3.retrain model
4.predict inference`;
}
function viewModelStats() {
  return "Model stats are being viewed";
}
function viewPrevSession() {
  return "Previous seesion details are:";
}
function retrainModel() {
  return "provide json and details";
}
function help() {
  return `Select one of the options below. Press help anytime to return to this menu \n 1.view deployed models
2. select model <modelname>`;
}
module.exports = commandMap;
