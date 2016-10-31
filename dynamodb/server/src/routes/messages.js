var Promise = require('bluebird');
var router = require('express').Router();
var controller = require('app-controller');
var config = require('../config');
var virgil = require('../providers/virgil');
var log = require('../providers/log');
var messageService = require('../modules/messages');

router.get('/history', controller(historyHandler));

function historyHandler (params) {
    var identity = params.identity;
    var channelName = params.channelName;

    return Promise.all([
      virgil.findCardByIdentity(identity),
      messageService.queryByChannel(channelName)
    ]).spread(function (recipientCard, messages) {
      var adminPrivateKey = virgil.crypto.importPrivateKey(
        new Buffer(config.app.channelAdminPrivateKey, 'base64'));

      messages.forEach(function (msg) {
        var recipientPubkey = virgil.crypto.importPublicKey(recipientCard.publicKey);
        var decryptedBody;
        try {
          decryptedBody = virgil.crypto.decrypt(msg.body, adminPrivateKey);
          msg.body = virgil.crypto.encrypt(decryptedBody, recipientPubkey).toString('base64');
        } catch (err) {
          log.error(err);
          msg.body = null;
        }
      });

      return messages.filter(function (msg) { return msg.body !== null; });
    });
}

module.exports = router;

