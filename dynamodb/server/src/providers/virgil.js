var _ = require('lodash');
var virgil = require('virgil-sdk');
var config = require('../config');

var client = virgil.client(config.virgil.accessToken, config.virgil.options);

module.exports = {
    crypto: virgil.crypto,
    registerVirgilCard: registerVirgilCard,
    findCardByIdentity: findCardByIdentity
};

function findCardByIdentity (identity) {
    return client.searchCards({
        identities: [identity],
        identity_type: 'chat_member'
    }).then(function (cards) {
        var last = _.last(_.sortBy(cards, 'createdAt'));
        return last;
    });
}

function registerVirgilCard (params) {
    var cardCreateRequest = virgil.cardCreateRequest.fromTransferFormat(params);
    var signer = virgil.requestSigner(virgil.crypto);
    var appPrivateKey = virgil.crypto.importPrivateKey(
        new Buffer(config.app.privateKey, 'base64'),
        config.app.privateKeyPassword
    );

    signer.authoritySign(cardCreateRequest, config.app.virgilCardId, appPrivateKey);

    return client.createCard(cardCreateRequest).then(function (card) {
        card.publicKey = card.publicKey.toString('base64');
        card.snapshot = card.snapshot.toString('base64');
        Object.keys(card.signatures).forEach(function (key) {
            card.signatures[key] = card.signatures[key].toString('base64');
        });
        return card;
    });
}