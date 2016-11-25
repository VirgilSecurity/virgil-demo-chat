'use strict';

var router = require('express').Router();
var jwt = require('express-jwt');
var virgil = require('../providers/virgil');
var channels = require('../modules/channels');
var errorHandler = require('../utils/error-handler');

router.post('/channels', jwt({ secret: process.env.JWT_SECRET }), createChannel);
router.get('/channels', jwt({ secret: process.env.JWT_SECRET }), getChannels);
router.get('/channels/:channel_id', jwt({ secret: process.env.JWT_SECRET }), getChannel);

function createChannel (req, res) {
  virgil.createVirgilCard(req.body.card_request)
    .then(function (virgilCard) {
      var channelInfo = {
        name: virgilCard.identity,
        ownerId: req.user.id,
        ownerName: req.user.username,
        virgilCardId: virgilCard.id,
        publicKey: virgilCard.publicKey
      };

      return channels.create(channelInfo);
    })
    .then(function (channel) {
      res.json(transformResponse(channel));
    })
    .catch(function (err) {
      errorHandler(res, err, 'Failed to create new channel.');
    });
}

function getChannels (req, res) {
  channels.queryByMember(req.user.id)
    .then(function (results) {
      res.json(results.map(transformResponse));
    })
    .catch(function (err) {
      errorHandler(res, err, 'Failed to get channels.');
    });
}

function getChannel (req, res) {
  channels.get(req.params.channel_id)
    .then(function (channel) {
      if (!channel) {
        res.status(404).json({ error: 'Channel with given id not found.' });
      } else if (!isChannelMember(channel, req.user.id)) {
        res.status(403).json({ error: 'Only channel members are allowed access.' });
      } else {
        res.json(transformResponse(channel));
      }
    })
    .catch(function (err) {
      errorHandler(res, err, 'Failed to get channel by Id.');
    })
}

function isChannelMember (channel, userId) {
  return channel.isPublic || channel.members.values.indexOf(userId) > -1;
}

function transformResponse (channel) {
  if (channel.publicKey && Buffer.isBuffer(channel.publicKey)) {
    channel.publicKey = channel.publicKey.toString('base64');
  }

  if (channel.members) {
    channel.members = channel.members.values;
  }
  return channel;
}

module.exports = router;

