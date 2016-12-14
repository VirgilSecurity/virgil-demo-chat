"use strict";
var virgil_service_1 = require('./virgil.service');
var Buffer = virgil_service_1.VirgilService.VirgilSDK.Buffer;
var Account = (function () {
    function Account(id, identity, identityType, publicKey, privateKey) {
        this.id = id;
        this.identity = identity;
        this.identityType = identityType;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    Account.prototype.toJSON = function () {
        var obj = {
            id: this.id,
            identity: this.identity,
            identityType: this.identityType,
            publicKey: virgil_service_1.VirgilService.Crypto.exportPublicKey(this.publicKey).toString('base64'),
            privateKey: virgil_service_1.VirgilService.Crypto.exportPrivateKey(this.privateKey).toString('base64')
        };
        return JSON.stringify(obj);
    };
    Account.fromJson = function (json) {
        var accountObject = JSON.parse(json);
        return new Account(accountObject.id, accountObject.identity, accountObject.identityType, virgil_service_1.VirgilService.Crypto.importPublicKey(new Buffer(accountObject.publicKey, 'base64')), virgil_service_1.VirgilService.Crypto.importPrivateKey(new Buffer(accountObject.privateKey, 'base64')));
    };
    return Account;
}());
exports.Account = Account;
//# sourceMappingURL=account.js.map