var Clicks = {};
Clicks.cursors = [];

Clicks.docReady = function() {

  $("body").click(function(e) {
    console.log("logging click");
    socket.emit('log', {
      'entry': {
        'type': 'click',
        'date': new Date(),
        'pos': { 'x': e.pageX, 'y': e.pageY }
      }
    });
    window.setTimeout(function() {
      Clicks.updateClicks();
    }, 100);
  });

  socket.on('sendClicks', Clicks.receiveClicks);

  Clicks.Vue = new Vue({
    el: '#clicks',
    data: {
      cursors: Clicks.cursors
    }
  })

  Clicks.updateClicks();
};


Clicks.updateClicks = function() {
  socket.emit("getClicks", {});
};

Clicks.receiveClicks = function(data) {
  Clicks.Vue.cursors = data.cursors;
};


