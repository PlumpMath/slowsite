var HistoryPaths = {};
HistoryPaths.cursors = [];
HistoryPaths.thisPath = [];
HistoryPaths.pathLengthMils = 2000;
HistoryPaths.pathFreq = 30;
HistoryPaths.pointCount = HistoryPaths.pathLengthMils / HistoryPaths.pathFreq;



HistoryPaths.coordsToPath = function(coords) {
  return LivePath.coordsToPath(coords);
}

HistoryPaths.coordsToSpline = function(coords) {
  return LivePath.coordsToSpline(coords);
}

HistoryPaths.docReady = function() {

  HistoryPaths.historyVue = new Vue({
    el: '#historypaths',
    data: {
      timeEnded: new Date(),
			paths: []
    },
		methods: {
			svgPath: HistoryPaths.coordsToPath
    },
		updated: function() {
			var paths = Snap.selectAll("path");
      paths.forEach(function(elem, i) {
        HistoryPaths.startLoopTrace(elem);
      });

			console.log("updated!!!");
		}

  })

  socket.on('sendPaths', HistoryPaths.receiveHistoryPaths);

	HistoryPaths.updateHistoryPaths();

};


HistoryPaths.startLoopTrace = function(elem) {
  var origid = elem.node.id.split("_")[1];
  if(origid == undefined) return;

  var thisTotalLen = Snap.path.getTotalLength(elem);
  Snap.animate(0, thisTotalLen, function(step) {
    var moveToPoint = Snap.path.getPointAtLength( elem, step );
    $("#pathpointer_" + origid).css("transform", "translate(" + moveToPoint.x + "px, " + moveToPoint.y + "px)");
//    Snap("#circle_" + origid).transform('t' + moveToPoint.x + ',' + moveToPoint.y ) 
  }, 5000, function(){

      HistoryPaths.startLoopTrace(elem); // loop forever

  });
}


HistoryPaths.updateHistoryPaths = function() {
  window.setTimeout(function() {
    socket.emit("getPaths", {});
  }, 100);
};

HistoryPaths.receiveHistoryPaths = function(data) {
  console.log(data);
	HistoryPaths.historyVue.paths = data.paths;
};


HistoryPaths.animateAlongPath = function( path, element, start, dur ) {
	var len = Snap.path.getTotalLength( path );
	setTimeout( function() {
		Snap.animate( 0, len, function( value ) {
			var movePoint = Snap.path.getPointAtLength(path,value);
			console.log(movePoint);
			element.transform('t' + movePoint.x + ',' + movePoint.y);
		}, dur,mina.easeinout); 
	});
} 

module.exports = HistoryPaths; 
