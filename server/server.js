require('dotenv').config();
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var registerRoute = require('./src/routes/register');
var virgilConfigRoute = require('./src/routes/virgil-config');
var path = require('path');

var rootDir = path.resolve(__dirname + '/../');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(express.static(rootDir + '/public/'));
app.use('/assets/', express.static(rootDir + '/node_modules/'));

app.get('/', function indexHandler(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(virgilConfigRoute);
app.use(registerRoute);

var members = Object.create(null);

io.on('connection', function (socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('newMessage', function (data) {
        // we tell the client to execute 'messageAdded'
        socket.broadcast.emit('messageAdded', {
            body: data
        });
    });

    // when the client emits 'join', this listens and executes
    socket.on('joinChannel', function (identity) {
        if (addedUser) return;

        members[socket.id] = identity;

        addedUser = true;
        socket.emit('joinedChannel', {
            members: Object.keys(members).map(function (sid) {
                return {
                    sid: sid,
                    identity: members[sid]
                };
            })
        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('memberJoined', {
            sid: socket.id,
            identity: identity
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {

            // echo globally that this client has left
            socket.broadcast.emit('memberLeft', {
                sid: socket.id,
                identity: members[socket.id]
            });

            delete members[socket.id];
        }
    });
});

server.listen(3000, function () {
    console.log('listening on *:3000');
});