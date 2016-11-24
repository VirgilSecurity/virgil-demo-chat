var virgil = require('virgil-sdk');
var config = require('../config');

var client = virgil.client(config.virgil.accessToken);

module.exports = {
    crypto: virgil.crypto,
    client: client,
    createVirgilCard: createVirgilCard,
    revokeVirgilCard: revokeVirgilCard
};

function createVirgilCard (request) {
    var cardCreateRequest = virgil.createCardRequest.import(request);

    signWithAppKey(cardCreateRequest);

    return client.createCard(cardCreateRequest).then(function (card) {
        card.publicKey = card.publicKey.toString('base64');
        card.snapshot = card.snapshot.toString('base64');
        Object.keys(card.signatures).forEach(function (key) {
            card.signatures[key] = card.signatures[key].toString('base64');
        });
        return card;
    });
}

function revokeVirgilCard (request) {
  var cardRevokeRequest = virgil.revokeCardRequest.import(request);

  signWithAppKey(cardRevokeRequest);

  return client.revokeCard(cardRevokeRequest);
}

function signWithAppKey (request) {
  var signer = virgil.requestSigner(virgil.crypto);

  var appPrivateKey = virgil.crypto.importPrivateKey(
    new Buffer(config.app.privateKey, 'base64'),
    config.app.privateKeyPassword
  );

  signer.authoritySign(request, config.app.virgilCardId, appPrivateKey);
}
