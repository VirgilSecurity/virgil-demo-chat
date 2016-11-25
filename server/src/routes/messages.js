var router = require('express').Router();
var jwt = require('express-jwt');
var virgil = require('../providers/virgil');
var messages = require('../modules/messages');
var channels = require('../modules/channels');
var errorHandler = require('../utils/error-handler');

router.get('/channels/:channel_id/messages', jwt({ secret: process.env.JWT_SECRET }), getMessages);

function getMessages (req, res) {
  var channelId = req.params.channel_id;
  var userId = req.user.id;

  channels.get(channelId)
    .then(function (channel) {
      if (!channels.isChannelMember(channel, userId)) {
        res.status(403).json({ error: 'Only channel members are allowed access.' });
      } else {
        return messages.queryByChannel(channelId).then(function (results) {
            res.json(results);
          });
      }
    })
    .catch(function (err) {
      errorHandler(res, err, 'Failed to get messages.');
    });
}

module.exports = router;

