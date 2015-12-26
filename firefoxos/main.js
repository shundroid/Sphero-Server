!function() {
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("s-connect").addEventListener("click", function() {
      spheroWS.connect(document.getElementById("s-server").value, document.getElementById("s-port").value, function() {
        console.log("connect");
      });
    });
    Array.prototype.forEach.call(document.getElementsByClassName("s-control"), i => {
      i.addEventListener("mousedown", function(e) {
        var angle = "no-send";
        var angles = {
          up: "0",
          right: "90",
          down: "180",
          left: "270"
        }
        angle = angles[e.target.dataset["dir"]];
        if (angle !== "no-send") {
          spheroWS.send("roll:100," + angle);
        }
      });
      i.addEventListener("mouseup", function(e) {
        spheroWS.send("stop:");
      });
    });
  });
}();
