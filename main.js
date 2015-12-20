"use strict";

var sphero = require("sphero");

var isRed = false;
var setting;
var fs = require("fs");
var orb;
function readSetting() {
  fs.readFile(__dirname + '/public_html/settings.json', 'utf-8', function(err, data) {
    setting = JSON.parse(data);
    orb = sphero(setting.sphero_serialport);
    orb.connect(connectSphero);
  });
}
var mimes = {
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css",
  "json": "application/json"
}
function createServer() {
  var http = require("http");
  var ws = require("websocket").server;
  var server = http.createServer(function(req, res) {
    var access_to = req.url;
    if (access_to === "/") access_to = "/index.html";
    fs.readFile(__dirname + "/public_html" + access_to, "utf-8", function(err, data) {
      res.writeHead(200, { "Content-Type": mimes[access_to.split(".")[1] ]});
      res.write(data);
      res.end();
    });
  }).listen(setting.port, setting.ip);
  var wsServer = new ws({ httpServer: server });
  wsServer.on('request', function(req) {
    req.origin = req.origin || '*';
    var websocket = req.accept(null, req.origin);
    websocket.on('message', function(msg) {
      console.log("msg! " + msg.utf8Data);
      var msg_key = msg.utf8Data.split(":")[0];
      var msg_value = msg.utf8Data.split(":")[1];
      if (msg_key === "color") {
        orb.color(msg_value);
      }
    });
    websocket.on('close', function(code, desc) {
      console.log("closed");
    });
  });
}
function connectSphero() {
  orb.color("blue");
  console.log("connected sphero");
  createServer();
};
readSetting();