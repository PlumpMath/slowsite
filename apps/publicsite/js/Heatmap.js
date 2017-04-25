var Heatmap = {};

Heatmap.docReady = function() {

  var heatmap = global.h337.create({
      container: $("#heatmap")[0]
  });

  heatmap.setData({
      max: 5,
      data: [{ x: 10, y: 15, value: 5}]
  });

};

 

module.exports = Heatmap; 
