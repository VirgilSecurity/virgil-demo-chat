'use strict';

var router = require('express').Router();
var jwt = require('express-jwt');
var escape = require('escape-html');
var virgil = require('../providers/virgil');
var log = require('../providers/log');
var channels = require('../modules/channels');

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
      log.error(err);
      res.status(400).json({ error: err.message });
    });
}

function getChannels (req, res) {
  channels.queryByMember(req.user.id)
    .then(function (results) {
      res.json(results.map(transformResponse));
    })
    .catch(function (err) {
      log.error(err);
      res.status(400).json({ error: err.message });
    });
}

function getChannel (req, res) {
  channels.get(req.params.channel_id)
    .then(function (channel) {
      if (!isChannelMember(channel, req.user.id)) {
        res.status(403).json({ error: 'You must be a member of the channel to get it.' });
      } else {
        res.json(transformResponse(channel));
      }
    })
    .catch(function (err) {
      log.error(err);
      res.status(404).json({ error: 'Channel with given Id not found.' });
    })
}

function isChannelMember (channel, userId) {
  return channel.isPublic || channel.members.indexOf(userId) > -1;
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

