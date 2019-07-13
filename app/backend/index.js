//import the require dependencies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/routes");
const Slackbot = require("slackbots");

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

const bot = new Slackbot({
  token: "xoxb-681011609554-694278002823-YmvjN3DzO3MR4tlnZiPJUk0N",
  name: "internhack"
});

bot.on("start", function() {
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  var params = {
    icon_emoji: ":sunglasses:"
  };

  // define existing username instead of 'user_name'
  bot.postMessageToChannel("general", "Hey!how are you guys doing !", params);
});

bot.on("error", err => {
  console.log(err);
});
bot.on("message", async data => {
  if (data.type != "message" || !data.client_msg_id) {
    return;
  }
  console.log(data);
  var params = {
    icon_emoji: ":sunglasses:"
  };
  let user = await bot.getUserById(data.user);
  console.log(user.name);
  bot.postMessageToUser(user.name, `Hey man 'ssup! your message was : ${data.text}`, params);
});
