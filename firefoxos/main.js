!function() {
  var isgyro = false;
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("s-gyro").addEventListener("change", function(e) {
      isgyro = e.target.checked;
    });
    document.getElementById("s-gyro").checked = false;
    document.getElementById("s-connect").addEventListener("click", function() {
      spheroWS.connect(document.getElementById("s-server").value, document.getElementById("s-port").value, function() {
        console.log("connect");
      });
    });
    Array.prototype.forEach.call(document.getElementsByClassName("s-control"), i => {
      i.addEventListener("touchstart", function(e) {
        if (isgyro) return;
        var angle = "no-send";
        var angles = {
          up: "0",
          right: "90",
          down: "180",
          left: "270"
        }
        angle = angles[e.target.dataset["dir"]];
        if (angle !== "no-send") {
          spheroWS.send("roll:255," + angle);
        }
      });
      i.addEventListener("touchend", function(e) {
        if (isgyro) return;
        spheroWS.send("stop:");
      });
    });
    window.addEventListener("deviceorientation", function(e) {
      if (!isgyro) return;
      var angle = (Math.atan2(-(e.gamma) * 2, e.beta)/(Math.PI/180)) + 180;
      spheroWS.send("roll:100," + angle);
    });
  });
}();
