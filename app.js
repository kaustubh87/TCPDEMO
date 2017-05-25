var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongo = require('mongodb').MongoClient;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
//app.get('/users', user.list);

var serve = http.createServer(app);
var io = require('socket.io')(serve);

serve.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function (socket) {
    console.log('a user connected');

    mongo.connect('mongodb://localhost:27017/socketio', function (err, db) {
        if(err){
            console.warn(err.message);
        } else {
            var collection = db.collection('chatmessages')
            var stream = collection.find().sort().limit(10).stream();
            stream.on('data', function (chat) { console.log('emitting chat'); socket.emit('chat', chat.content); });
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat', function (msg) {
        mongo.connect('mongodb://localhost:27017/socketio', function (err, db) {
            if(err){
                console.warn(err.message);
            } else {
                var collection = db.collection('chatmessages');
                collection.insert({ content: msg }, function (err, o) {
                    if (err) { console.warn(err.message); }
                    else { console.log("chat message inserted into db: " + msg); }
                });
            }
        });

        socket.broadcast.emit('chat', msg);
    });
});
