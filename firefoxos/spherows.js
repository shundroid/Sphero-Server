var spheroWS = {};
(function() {
  var ws;
  spheroWS.connect = function(server, port) {
    ws = new WebSocket("ws://" + server + ":" + port);
    ws.onmessage = (e) => {
      console.log(e.data);
    };
    ws.onclose = (e) => {
      console.log("disconnect")
    }
  }
  spheroWS.send = function(msg) {
    ws.send(msg);
  }
})();