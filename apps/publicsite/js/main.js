global.$ = require('jquery');
global._ = require('lodash');
global.io = require('socket.io-client');
global.Snap = require('snapsvg');
global.Vue = require('vue');
global.SVGCatmullRomSpline = require('svg-catmull-rom-spline');
global.h337 = require('heatmap.js');
global.Queue = require('fastqueue');
global.TWEEN = require('tween.js');

global.Clicks = require('./Clicks.js');
global.LivePath = require('./LivePath.js');
global.HistoryPaths = require('./HistoryPaths.js');
global.Heatmap = require('./Heatmap.js');

global.Main = {};
Main.settings = {};
Main.settings.clicklimit = 20;
Main.settings.pathlimit = 20;


$(function () {
  
  var socket = io("localhost:3000");
  //var socket = io("192.168.1.4:3000");
  window.socket = socket;
//      socket.emit('broadcast', {data: 'foo!'});
  socket.emit('echo', {data: 'ho'});
  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));

  Clicks.docReady();
  LivePath.docReady();
  HistoryPaths.docReady();
//  Heatmap.docReady();
  //

  function update() {
    TWEEN.update();
  }
  setInterval(update, 33); // 33 milliseconds = ~ 30 frames per sec

});

