var socketServer = require('socket.io');
var messageService = require('../messages');

function createChat (server) {
  var io = socketServer(server);
  var members = Object.create(null);
  
  return {
    start: startChat
  };
  
  function startChat () {
    io.on('connection', function (socket) {
      var addedUser = false;

      // when the client emits 'new message', this listens and executes
      socket.on('newMessage', function (params) {
        messageService.create(params).then(function (message) {
          // we tell the client to execute 'messageAdded'
          socket.broadcast.emit('messageAdded', message);
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
  }
}

module.exports = createChat;
