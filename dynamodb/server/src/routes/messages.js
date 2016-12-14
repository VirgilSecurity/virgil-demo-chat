var router = require('express').Router();
var jwt = require('express-jwt');
var virgil = require('../providers/virgil');
var messages = require('../modules/messages/index');
var channels = require('../modules/channels/index');
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
            res.json(results.map(transformMessage));
          });
      }
    })
    .catch(function (err) {
      errorHandler(res, err, 'Failed to get messages.');
    });
}

function transformMessage (msg) {
  if (Buffer.isBuffer(msg.body)) {
    msg.body = msg.body.toString('base64');
  }
  return msg;
}

module.exports = router;

