require('dotenv').load();

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var config = require('./src/config');
var log = require('./src/providers/log');
var router = require('./src/routes');
var chat = require('./src/modules/chat')(server);

var rootDir = path.resolve(__dirname + '/../');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(express.static(rootDir + '/public/'));
app.use('/assets/', express.static(rootDir + '/node_modules/'));

app.get('/', function indexHandler(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(router);

app.use(function (error, request, response, next) {
  log.error('application error', error, error.stack);
  response.status(500).json({error: 'internal error'});
});

server.listen(config.app.port, function () {
    console.log('listening on *:', config.app.port);
});

chat.start();
