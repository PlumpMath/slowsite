var Paths = {};
Paths.cursors = [];
Paths.thisPath = [];
Paths.pathLengthMils = 5000;
Paths.pathFreq = 30;
Paths.pointCount = Paths.pathLengthMils / Paths.pathFreq;


Paths.handleMouseMove = function(e) {
  console.log(e.pageX + "," + e.pageY);
};

Paths.pushToQueue = function(val) {
  Paths.Vue.thisPath.push(val);
  Paths.Vue.timeEnded = new Date();
  if(Paths.Vue.thisPath.length > Paths.pointCount) { Paths.Vue.thisPath.shift(); }
}

Paths.docReady = function() {
	Paths.tempCircle = Snap("#svg").paper.circle(10, 10, 10);


  $("html").mousemove(function(e){
     window.mouseX = e.pageX;
     window.mouseY = e.pageY;
  });

  window.setInterval(function() {
//    console.log(window.mouseX + "," + window.mouseY);
    Paths.pushToQueue([window.mouseX, window.mouseY]);
  }, Paths.pathFreq);


  $("body").click(function(e) {
    console.log("logging click");
    socket.emit('log', {
      'entry': {
        'type': 'path',
        'date': new Date(),
        'path': Paths.Vue.thisPath
      }
    });
    window.setTimeout(function() {
      Paths.updatePaths();
    }, 100);
  });

  socket.on('sendPaths', Paths.receivePaths);

	Paths.updatePaths();


  Paths.Vue = new Vue({
    el: '#paths',
    data: {
      timeEnded: new Date(),
      thisPath: Paths.thisPath,
			paths: []
    },
		methods: {
			svgPath: function (p) {
				if(typeof(p[0][0]) == "undefined") return;
				var sp = "M" + p[0][0] + "," + p[0][1];
				sp += _.map(p, function(v) {
					if(typeof(v[0]) != "undefined") 
					return "L" + v[0] + "," + v[1];
				}).join("");
				return sp;
			}
		},
		updated: function() {
//			console.log("updated!!!");
		}

  })


};




Paths.updatePaths = function() {
  socket.emit("getPaths", {});
};

Paths.receivePaths = function(data) {
  console.log(data);
	Paths.Vue.paths = data.paths;
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
