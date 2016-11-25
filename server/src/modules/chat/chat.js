'use strict';

var debug = require('debug')('virgil:chat');
var escape = require('escape-html');
var socketServer = require('socket.io');
var socketioJwt = require('socketio-jwt');

var messages = require('../messages');
var channels = require('../channels');
var users = require('../users');

function createChat (server) {
  var io = socketServer(server);
  var members = Object.create(null);

  return {
    start: startChat
  };

  function startChat () {
    io.on('connection', socketioJwt.authorize({
        secret: process.env.JWT_SECRET,
        timeout: 10000 // 10 seconds to send the 'authenticate' message
      }))
      .on('authenticated', function (socket) {
        var user = socket.decoded_token;
        var userId = user.id;

        debug(user.username, 'authenticated');

        users.setIsOnline(userId, true);
        members[userId] = socket.id;

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('member connected', {
          member: user
        });

        socket.on('join channel', function (params) {
          debug(user.username, 'joined', params.channelId);
          socket.join(params.channelId);
        });

        socket.on('leave channel', function (params) {
          debug(user.username, 'left', params.channelId);
          socket.leave(params.channelId);
        });

        socket.on('post message', function (params) {
          debug(user.username, 'posted message');
          var props = {
            body: params.body,
            channelId: params.channelId,
            author: user.username
          };

          messages.create(props).then(function (message) {
            // tell all the clients in a channel to execute 'message posted'
            socket.broadcast.to(params.channelId).emit('message posted', message);
          });
        });

        socket.on('add members', function (params) {
          debug(user.username, 'adds members', params);
          var channelId = params.channelId;
          var memberIds = params.memberIds;

          channels.get(channelId)
            .then(function (channel) {
              // TODO check that requesting user is a member of given channel

              channels.addMembers(channelId, memberIds)
                .then(function () {
                  var invitation = {
                    channelId: channelId,
                    channelName: channel.name,
                    channelKey: escape(params.channelKey),
                    addedBy: user.username
                  };

                  debug('channel members added. notifying...');
                  memberIds.forEach(function (memberId) {
                    if (memberId in members) {
                      io.to(members[memberId]).emit('added to channel', invitation);
                    }
                  })
                });
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
          debug(user.username, 'disconnected');
          if (userId in members) {

            users.setIsOnline(userId, false);
            delete members[userId];

            // echo globally that this client has left
            socket.broadcast.emit('member disconnected', {
              member: user
            });
          }
        });
      });
  }
}

module.exports = createChat;
