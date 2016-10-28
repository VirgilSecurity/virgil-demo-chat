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
var _ = require('lodash');
var core_1 = require('@angular/core');
var virgil_service_1 = require('../services/virgil.service');
var messaging_service_1 = require('../services/messaging.service');
var backend_service_1 = require('../services/backend.service');
var login_component_1 = require('./login.component');
var chat_component_1 = require('./chat.component');
var account_service_1 = require('../services/account.service');
var AppComponent = (function () {
    function AppComponent(virgil, messaging, account, backend, cd) {
        this.virgil = virgil;
        this.messaging = messaging;
        this.account = account;
        this.backend = backend;
        this.cd = cd;
        this.isReady = false;
        this.isLoggedIn = false;
        this.loginCallback = this.onLogin.bind(this);
        this.logoutCallback = this.onLogout.bind(this);
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.account.hasAccount()) {
            this.initializeServices(this.account.current.identity)
                .then(function () {
                _this.isLoggedIn = true;
                _this.isReady = true;
                _this.cd.detectChanges();
            });
            return;
        }
        this.isReady = true;
        this.isLoggedIn = false;
        this.cd.detectChanges();
    };
    AppComponent.prototype.authenticate = function (nickName) {
        var _this = this;
        return this.initializeServices(nickName)
            .then(function () { return _this.createCard(nickName); })
            .then(function (keysBundle) {
            debugger;
            var userAccount = new account_service_1.Account(keysBundle.id, keysBundle.identity, 'chat_member', keysBundle.publicKey, keysBundle.privateKey);
            return _this.account.setCurrentAccount(userAccount);
        })
            .catch(function (error) {
            throw error;
        });
    };
    AppComponent.prototype.initializeServices = function (identity) {
        var _this = this;
        return this.backend.getVirgilConfig()
            .then(function (data) {
            _this.virgil.initialize(data.virgil_token, data.virgil_urls);
            return _this.virgil.client.searchCards({
                identities: [data.virgil_app_bundle_id],
                identity_type: 'application',
                scope: 'global'
            });
        })
            .then(function (cards) {
            var appCard = _.last(_.sortBy(cards, 'createdAt'));
            _this.backend.setAppPublicKey(_this.virgil.crypto.importPublicKey(appCard.publicKey));
            return _this.messaging.initialize(identity);
        });
    };
    AppComponent.prototype.onLogin = function (nickName) {
        var _this = this;
        this.authenticate(nickName).then(function () {
            _this.isReady = true;
            _this.isLoggedIn = true;
            _this.cd.detectChanges();
        });
    };
    AppComponent.prototype.onLogout = function () {
        this.account.logout();
        window.location.reload();
    };
    AppComponent.prototype.createCard = function (username) {
        var keyPair = this.virgil.crypto.generateKeys();
        var rawPublicKey = this.virgil.crypto.exportPublicKey(keyPair.publicKey);
        var request = virgil_service_1.VirgilService.VirgilSDK.cardCreateRequest({
            identity: username,
            identity_type: 'chat_member',
            scope: 'application',
            public_key: rawPublicKey
        });
        var signer = virgil_service_1.VirgilService.VirgilSDK.requestSigner(this.virgil.crypto);
        signer.selfSign(request, keyPair.privateKey);
        debugger;
        return this.backend.createVirgilCard(request.toTransferFormat())
            .then(function (card) {
            debugger;
            return _.assign({}, card, keyPair);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'ipm-app',
            templateUrl: './assets/views/app.component.html',
            directives: [login_component_1.LoginComponent, chat_component_1.ChatComponent]
        }), 
        __metadata('design:paramtypes', [virgil_service_1.VirgilService, messaging_service_1.MessagingService, account_service_1.AccountService, backend_service_1.BackendService, core_1.ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map