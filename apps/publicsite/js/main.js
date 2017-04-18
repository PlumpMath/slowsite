

$(function () {


  var socket = io("localhost:3000");
  window.socket = socket;
//      socket.emit('broadcast', {data: 'foo!'});
  socket.emit('echo', {data: 'ho'});
  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));

  Clicks.docReady();

  new Vue({
      el: '#editor',
      data: {
            input: '# hello'
          },
      computed: {
            compiledMarkdown: function () {
                    return this.input + "BOO";
                  }
          },
      methods: {
            update: _.debounce(function (e) {
                    this.input = e.target.value
                  }, 300)
          }
  })

});

