var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongo = require('mongodb').MongoClient;

app.set('port' , process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname+ 'public')));

app.get('/', routes.index);

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' +app.get('port'));
});

io.on('connection', function(socket){

  console.log('A user connected');

  socket.on('disconnect', function(){
      console.log('User disconnected');
  });

});
