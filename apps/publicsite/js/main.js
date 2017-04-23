global.$ = require('jquery');
global._ = require('lodash');
global.io = require('socket.io-client');
global.Snap = require('snapsvg');
global.Vue = require('vue');
global.d3Path = require('d3-path');
global.d3Shape = require('d3-shape');
global.SVGCatmullRomSpline = require('svg-catmull-rom-spline');


global.Clicks = require('./Clicks.js');
global.Paths = require('./Paths.js');

$(function () {
  
  var socket = io("localhost:3000");
  //var socket = io("192.168.1.4:3000");
  window.socket = socket;
//      socket.emit('broadcast', {data: 'foo!'});
  socket.emit('echo', {data: 'ho'});
  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));

  Clicks.docReady();
  Paths.docReady();


});

