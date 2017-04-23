global. _ = require('lodash');
global. io = require('socket.io-client');
global.Snap = require('snapsvg');
global.Vue = require('vue');
global. Clicks = require('./Clicks.js');
global. Paths = require('./Paths.js');
global.$ = require('jquery');

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

