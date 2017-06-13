var LivePath = {};
LivePath.thisPath = [];
LivePath.pathLengthMils = 1500;
LivePath.pathFreq = 20;
LivePath.pointCount = LivePath.pathLengthMils / LivePath.pathFreq;


LivePath.handleMouseMove = function(e) {
  console.log(e.pageX + "," + e.pageY);
};

LivePath.pushToQueue = function(val) {
  if(val[0] != null) {
    LivePath.thisPath.push(val);
    LivePath.timeEnded = new Date();
    if(LivePath.thisPath.length > LivePath.pointCount) { LivePath.thisPath.shift(); }
  }
}

LivePath.coordsToPath = function(coords) {
  if(coords == undefined || typeof(coords[0]) == "undefined" || typeof(coords[0][0]) == "undefined") return;
  var sp = "";
  sp += _.map(coords, function(v, i) {
    if(typeof(v[0]) != "undefined") {
      if(i == 0) return "M" + v[0] + "," + v[1];
      if(i > 0) return  " L" + v[0] + "," + v[1];
    } else {
      return "";
    }
  }).join("");
  return sp;
}

LivePath.coordsToSpline = function(coords) {
  if(coords == undefined || typeof(coords[0]) == "undefined" || typeof(coords[0][0]) == "undefined") return;
  var tolerance = 2;
  var highestQuality = false;
  var pathStr = SVGCatmullRomSpline.toPath(coords, tolerance, highestQuality);
  return pathStrr
}

LivePath.startMouseTracking = function() {
  console.log("(re)starting mouse tracking");
  if('mouseIntervalProcess' in LivePath) { clearInterval(LivePath.mouseIntervalProcess); }
  LivePath.mouseIntervalProcess = window.setInterval(function() {
    LivePath.pushToQueue([window.mouseX, window.mouseY]);
  }, LivePath.pathFreq);
}




LivePath.docReady = function() {
  
  LivePath.thispathVue = new Vue({
    el: '#thispath',
    data: {
			thisPath: LivePath.thisPath
    },
		methods: {
			svgPath: LivePath.coordsToPath
		}
  })

  $("body").mousemove(function(e){
     window.mouseX = e.pageX;
     window.mouseY = e.pageY;
  });

  LivePath.startMouseTracking();

  $("body").click(function(e) {
    console.log("logging click");
    socket.emit('log', {
      'entry': {
        'type': 'path',
        'date': new Date(),
        'path': LivePath.thisPath
      }
    });
    HistoryPaths.updateHistoryPaths();
    LivePath.startMouseTracking();
  });

};

module.exports = LivePath; 
