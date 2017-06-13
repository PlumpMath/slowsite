var HistoryPaths = {};
HistoryPaths.cursors = [];
HistoryPaths.thisPath = [];
HistoryPaths.pathLengthMils = 2000;
HistoryPaths.pathFreq = 30;
HistoryPaths.pointCount = HistoryPaths.pathLengthMils / HistoryPaths.pathFreq;
HistoryPaths.animates = {};


HistoryPaths.coordsToPath = function(coords) {
  return LivePath.coordsToPath(coords);
}

HistoryPaths.coordsToSpline = function(coords) {
  return LivePath.coordsToSpline(coords);
}

HistoryPaths.startLoopTrace = function(elem) {

  var origid = elem.node.id.split("_")[1];
  if(origid == undefined) return;

  var thisPointer =  $("#pathpointer_" + origid);
  
  var pathPoints = Snap.parsePathString(elem.node.getAttribute("d"));
  var pathLen = Snap.path.getTotalLength(elem);

  var pathXs =  _.map(pathPoints, function(d) { return d[1]; });
  var pathYs =  _.map(pathPoints, function(d) { return d[2]; });

  var position = { x : pathXs[0], y: pathYs[0] };
  var tween = new TWEEN.Tween(position)
    .to({
      x: pathXs,
      y: pathYs
      }, 2000)
    .onUpdate(function() {
      thisPointer.css("transform", "translate(" + this.x + "px, " + this.y + "px)");
    });
  tween.interpolation(TWEEN.Interpolation.CatmullRom);
  tween.delay(_.random(4000));
  tween.chain(tween);
  tween.start();


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


HistoryPaths.docReady = function() {

  var position = { x : 0, y: 300 };
  var tween = new TWEEN.Tween(position)
    .to({
      x: [0, -100, 100],
      y: [0, -100, 500]
      });
  tween.onUpdate(function() {
        //console.log(this);
  });
  tween.chain(tween);
  tween.start();


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



module.exports = HistoryPaths; 
