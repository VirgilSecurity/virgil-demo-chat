"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
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
var AccountService = (function () {
    function AccountService() {
        this.currentAccount = this.loadAccount();
    }
    Object.defineProperty(AccountService.prototype, "current", {
        get: function () {
            return this.currentAccount;
        },
        enumerable: true,
        configurable: true
    });
    AccountService.prototype.hasAccount = function () {
        return this.currentAccount != null && this.currentAccount.identityType;
    };
    AccountService.prototype.setCurrentAccount = function (account) {
        this.currentAccount = account;
        this.storeAccount(account);
    };
    AccountService.prototype.logout = function () {
        localStorage.removeItem('account');
    };
    AccountService.prototype.storeAccount = function (storeAccount) {
        localStorage.setItem('account', storeAccount.toJSON());
    };
    AccountService.prototype.loadAccount = function () {
        var accountJsonString = localStorage.getItem('account');
        if (accountJsonString == null) {
            return null;
        }
        return Account.fromJson(accountJsonString);
    };
    AccountService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AccountService);
    return AccountService;
}());
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map