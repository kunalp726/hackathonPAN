//import the require dependencies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/routes");
const Slackbot = require("slackbots");
const commandMap = require("./commands");
//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: false }));

//Allow Access Control
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Cache-Control", "no-cache");
  next();
});
app.use(bodyParser.json());

app.use("/routes", router);
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");

///slack bot code

function errorMessage() {
  return "Please enter a valid command! type 'help' to start ";
}
const bot = new Slackbot({
  token: "",
  name: "internhack"
});

bot.on("start", function() {
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  var params = {
    icon_emoji: ":sunglasses:"
  };

  // define existing username instead of 'user_name'
  bot.postMessageToChannel("general", "Hey! I am the ML hackBot", params);
});
bot.on("error", err => {
  console.log(err);
});
let predictNext = false;
bot.on("message", async data => {
  if (data.type != "message" || !data.client_msg_id) {
    return;
  }
  var params = {
    icon_emoji: ":sunglasses:"
  };
  let user = await bot.getUserById(data.user);
  let currentCommand = "";
  if (data.text.indexOf("hi ") >= 0) {
    currentCommand = commandMap["hi"];
  } else if (data.text.indexOf("select model") >= 0) {
    let name = data.text.split("select model");
    name = name[name.length - 1];
    currentCommand = commandMap["select model"];
    bot.postMessageToUser(user.name, currentCommand(name.trim()), params);
    return;
  } else {
    console.log('predictNext');
    console.log(predictNext);
    if (predictNext) {
      predictNext = !predictNext;
      currentCommand = commandMap["predictExec"];
      bot.postMessageToUser(
        user.name,
        currentCommand(data.text, user.name),
        params
      );
      return;
    }
    if (data.text == "predict") {
      predictNext = true;
    }
    console.log('data.text');
    console.log(data.text);
    console.log(predictNext);
    currentCommand = commandMap[data.text];
  }
  if (currentCommand) {
    bot.postMessageToUser(user.name, currentCommand(user.name), params);
  } else {
    bot.postMessageToUser(user.name, errorMessage(), params);
  }
});
