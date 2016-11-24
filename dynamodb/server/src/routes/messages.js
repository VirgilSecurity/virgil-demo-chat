var router = require('express').Router();
var jwt = require('express-jwt');
var virgil = require('../providers/virgil');
var log = require('../providers/log');
var messages = require('../modules/messages');

router.get('/channels/:channel_id/messages', jwt({ secret: process.env.JWT_SECRET }), getMessages);

function getMessages (req, res) {
  var channelId = req.params.channel_id;

  // TODO check that requesting user is a member of given channel

  messages.queryByChannel(channelId)
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      res.status(400).json({ error: err.message });
    });
}

module.exports = router;

