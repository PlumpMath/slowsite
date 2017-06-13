var Clicks = {};
Clicks.cursorclicks = [];

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
    el: '#cursorclicks',
    data: {
      cursorclicks: Clicks.cursorclicks
    }
  })

  Clicks.updateClicks();
};


Clicks.updateClicks = function() {
  socket.emit("getClicks", { 'limit': Main.settings.clicklimit });
};

Clicks.receiveClicks = function(data) {
  Clicks.Vue.cursorclicks = data.cursorclicks;
};


module.exports = Clicks;
