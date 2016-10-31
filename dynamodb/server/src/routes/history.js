var Promise = require('bluebird');
var express = require('express');
var controller = require('app-controller');
var config = require('../config');
var virgil = require('../providers/virgil');
var messageService = require('../modules/messages');
var router = express.Router();

router.get('/history', controller(historyHandler));

function historyHandler (params) {
    var identity = params.identity;
    var channelName = params.channelName;
    
    return Promise.all([
        virgil.findCardByIdentity(identity),
        messageService.queryByChannelName(channelName)
    ]).spread(function (recipientCard, messages) {
        messages.forEach(function (msg) {
            var adminPrivateKey = virgil.crypto.importPrivateKey(new Buffer(config.app.channelAdminPrivateKey, 'base64'));
            var decryptedBody = virgil.crypto.decrypt(msg.body, adminPrivateKey);
            var recipientPubkey = virgil.crypto.importPublicKey(recipientCard.publicKey);
            var reEncryptedBody = virgil.crypto.encrypt(decryptedBody, recipientPubkey);

            msg.body = reEncryptedBody;
        });

        return messages;
    });
}

module.exports = router;

