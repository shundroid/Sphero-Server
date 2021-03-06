"use strict";

var sphero = require("sphero");
var http = require("http");
var websocket = require("websocket");

var isRed = false;
var setting;
var fs = require("fs");
var orb;
var server;
var wsMessage;

function main() {
  readSetting(() => {
    createServer();
    console.log("server created");
    orb.connect(connectSphero);
    initWSServer(); 
  });
}

function readSetting(callBack) {
  fs.readFile(__dirname + '/public_html/settings.json', 'utf-8', function(err, data) {
    setting = JSON.parse(data);
    orb = sphero(setting.sphero_serialport);
    callBack();
  });
}
var mimes = {
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css",
  "json": "application/json"
}
function createServer() {
  server = http.createServer(function(req, res) {
    var access_to = req.url;
    if (access_to === "/") access_to = "/index.html";
    fs.readFile(__dirname + "/public_html" + access_to, "utf-8", function(err, data) {
      res.writeHead(200, { "Content-Type": mimes[access_to.split(".")[1] ]});
      res.write(data.toString());
      res.end();
    });
  }).listen(setting.port, setting.ip);
}
function initWSServer() {
  var ws = websocket.server;
  var wsServer = new ws({ httpServer: server });
  wsServer.on('request', function(req) {
    req.origin = req.origin || '*';
    wsMessage = req.accept(null, req.origin);
    wsMessage.send("start websocket");
    wsMessage.on('message', processWSMessage);
    wsMessage.on('close', function(code, desc) {
      console.log("closed");
    });
  });
}
function connectSphero() {
  orb.color("blue");
  console.log("connected sphero");
}

function processWSMessage(msg) {
  console.log("msg! " + msg.utf8Data);
  var msg_key = msg.utf8Data.split(":")[0];
  var msg_value = msg.utf8Data.split(":")[1];
  var isOkSend = true;
  switch (msg_key) {
    case "color":
      orb.color(msg_value);
      break;
    case "get":
      isOkSend = false;
      switch (msg_value) {
        case "color":
          orb.getColor(function(err, data) {
            wsMessage.send(data.color);
          });
          break;
      }
      break;
    case "roll":
      var power = msg_value.split(",")[0];
      var angle = msg_value.split(",")[1];
      orb.roll(parseInt(power), parseInt(angle));
      break;
    case "stop":
      orb.roll(0, 0);
      break;
  }
  if (isOkSend) {
    wsMessage.send("OK.");
  }
}
main();
