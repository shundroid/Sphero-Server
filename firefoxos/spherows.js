var spheroWS = {};
(function() {
  var ws;
  spheroWS.connect = function(server, port, onConnectCallback) {
    ws = new WebSocket("ws://" + server + ":" + port);
    ws.onmessage = (e) => {
      console.log(e.data);
      if (e.data === "start websocket") {
        onConnectCallback();
      }
    };
    ws.onclose = (e) => {
      console.log("disconnect")
    }
  }
  spheroWS.send = function(msg) {
    ws.send(msg);
  }
})();