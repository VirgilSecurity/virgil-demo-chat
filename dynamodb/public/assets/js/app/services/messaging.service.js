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
var virgil_service_1 = require('./virgil.service');
var channelNames = ['general'];
var MessagingService = (function () {
    function MessagingService(virgilService) {
        this.virgilService = virgilService;
    }
    MessagingService.prototype.initialize = function (username) {
        var _this = this;
        this.username = username;
        return Promise.all([
            this.initSocket(),
            this.loadAdminVirgilCard()
        ]).then(function (results) {
            var adminCard = results[1];
            if (adminCard) {
                _this.adminPublicKey = _this.virgilService.crypto.importPublicKey(adminCard.publicKey);
            }
            else {
                _this.adminPublicKey = null;
            }
            return null;
        });
    };
    MessagingService.prototype.getChannels = function () {
        var _this = this;
        return Promise.resolve(channelNames.map(function (channelName) { return new Channel(_this.socket, _this.username, channelName, _this.adminPublicKey); }));
    };
    MessagingService.prototype.initSocket = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket = io();
            _this.socket.on('connect', function () {
                resolve(null);
            });
            _this.socket.on('connect_error', function (err) {
                reject(err);
            });
        });
    };
    MessagingService.prototype.loadAdminVirgilCard = function () {
        return this.virgilService.client.searchCards({
            identities: ['ip_messaging_chat_admin']
        }).then(function (cards) { return _.last(_.sortBy(cards, 'createdAt')); });
    };
    MessagingService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [virgil_service_1.VirgilService])
    ], MessagingService);
    return MessagingService;
}());
exports.MessagingService = MessagingService;
var Channel = (function () {
    function Channel(socket, username, channelName, publicKey) {
        this.socket = socket;
        this.username = username;
        this.socket = socket;
        this.channelName = channelName;
        this.sid = this.socket.sid;
        this.publicKey = publicKey;
    }
    Object.defineProperty(Channel.prototype, "friendlyName", {
        get: function () {
            return this.channelName;
        },
        enumerable: true,
        configurable: true
    });
    Channel.prototype.join = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socket.emit('joinChannel', _this.username);
            _this.socket.on('joinedChannel', function (data) {
                _this.members = data.members;
                resolve(null);
            });
        });
    };
    Channel.prototype.getMembers = function () {
        return Promise.resolve(this.members);
    };
    Channel.prototype.sendMessage = function (msg) {
        this.socket.emit('newMessage', msg);
    };
    Channel.prototype.on = function (eventName, callback) {
        this.socket.on(eventName, callback);
    };
    return Channel;
}());
exports.Channel = Channel;
//# sourceMappingURL=messaging.service.js.map