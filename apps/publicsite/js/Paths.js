var Paths = {};
Paths.cursors = [];
Paths.thisPath = [];
Paths.pathLengthMils = 2000;
Paths.pathFreq = 30;
Paths.pointCount = Paths.pathLengthMils / Paths.pathFreq;


Paths.handleMouseMove = function(e) {
  console.log(e.pageX + "," + e.pageY);
};

Paths.pushToQueue = function(val) {
  if(val[0] != null) {
    Paths.thisPath.push(val);
    Paths.timeEnded = new Date();
    if(Paths.thisPath.length > Paths.pointCount) { Paths.thisPath.shift(); }
  }
}

Paths.coordsToPath = function(coords) {
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

Paths.coordsToSpline = function(coords) {
  if(coords == undefined || typeof(coords[0]) == "undefined" || typeof(coords[0][0]) == "undefined") return;
  var tolerance = 2;
  var highestQuality = false;
  var pathStr = SVGCatmullRomSpline.toPath(coords, tolerance, highestQuality);
  return pathStr;
}

Paths.docReady = function() {
	Paths.tempCircle = Snap("#svg").paper.circle(10, 10, 10);

  Paths.historyVue = new Vue({
    el: '#historypaths',
    data: {
      timeEnded: new Date(),
			paths: []
    },
		methods: {
			svgPath: Paths.coordsToSpline
    },
		updated: function() {
//			console.log("updated!!!");
		}

  })

  Paths.thispathVue = new Vue({
    el: '#thispath',
    data: {
			thisPath: Paths.thisPath
    },
		methods: {
			svgPath: Paths.coordsToPath
		}
  })

  $("html").mousemove(function(e){
     window.mouseX = e.pageX;
     window.mouseY = e.pageY;
  });

  window.setInterval(function() {
    Paths.pushToQueue([window.mouseX, window.mouseY]);
  }, Paths.pathFreq);


  $("body").click(function(e) {
    console.log("logging click");
    socket.emit('log', {
      'entry': {
        'type': 'path',
        'date': new Date(),
        'path': Paths.thisPath
      }
    });
    Paths.updatePaths();
  });

  socket.on('sendPaths', Paths.receivePaths);

	Paths.updatePaths();

};




Paths.updatePaths = function() {
  window.setTimeout(function() {
    socket.emit("getPaths", {});
  }, 100);
};

Paths.receivePaths = function(data) {
  console.log(data);
	Paths.historyVue.paths = data.paths;
};

Paths.triggerAnimate = function() {
	var rect = Snap("#svg").rect(60,0,20,20).attr({ fill: 'blue', opacity: 0 });

	Snap.selectAll('path').forEach(function(p) {
		var newRect = rect.clone().attr({ opacity : 1});
		drawRect(newRect, p);
	});

	function drawRect( el, path ) {
			el.drawAtPath(path, 7000, { callback: drawRect.bind(null, el, path) } );
	};

}

Paths.animateAlongPath = function( path, element, start, dur ) {
	var len = Snap.path.getTotalLength( path );
	setTimeout( function() {
		Snap.animate( 0, len, function( value ) {
			var movePoint = Snap.path.getPointAtLength(path,value);
			console.log(movePoint);
			element.transform('t' + movePoint.x + ',' + movePoint.y);
		}, dur,mina.easeinout); 
	});
} 

module.exports = Paths; 
