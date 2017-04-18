var http = require('http');
var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = new Datastore({ filename: './dbfile', autoload: true });


////////////////////////////////
///////// ROUTES HERE //////////
////////////////////////////////

app.get('/', function(req, res){
    res.sendFile(__dirname + '/apps/publicsite/index.html');
});

app.get('/app1', function(req, res){
    res.sendFile(__dirname + '/apps/app1/index.html');
});



if (require.main === module) {
  var server = http.createServer(app);

  server.listen(process.env.PORT || 3000, function() {
    console.log("Listening on %j", server.address());
  });


  var io = require('socket.io')(server);

  io.on('connection', (socket) => {
		console.log('connect ' + socket.id);

		socket.on('echo', function (data) {
			console.log("oh we got data!");
			console.log(data);
			console.log("echoing back data!");
			socket.emit('message', data); // send to just the person who responded
		});

		socket.on('broadcast', function (data) {
			console.log("oh we got data!");
			console.log(data);
			console.log("broadcasting data!");
			socket.broadcast.emit('message', data); // send to everyone
		});

		socket.on('log', function (data) {
			console.log("oh we got data!");
			db.insert(data.entry, function (err, newDoc) {   // Callback is optional
				console.log(newDoc);
			});
		});

		socket.on('getClicks', function (data) {
      db.find({ 'type': 'click' }, function(err, docs) {
        var data = {};
        data.cursors = docs;
        console.log(docs);
			  socket.emit('sendClicks', data); // send to just the person who responded
      });
		});

		socket.on('disconnect', () => console.log('disconnect ' + socket.id));

  });

}


///////// express server a



