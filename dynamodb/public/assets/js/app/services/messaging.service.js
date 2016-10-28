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
var channelNames = ['general'];
var MessagingService = (function () {
    function MessagingService() {
    }
    MessagingService.prototype.initialize = function (username) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.username = username;
            _this.socket = io();
            _this.socket.on('connect', function () {
                resolve(null);
            });
            _this.socket.on('connect_error', function (err) {
                reject(err);
            });
        });
    };
    MessagingService.prototype.getChannels = function () {
        var _this = this;
        return Promise.resolve(channelNames.map(function (channelName) { return new Channel(_this.socket, _this.username, channelName); }));
    };
    MessagingService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MessagingService);
    return MessagingService;
}());
exports.MessagingService = MessagingService;
var Channel = (function () {
    function Channel(socket, username, channelName) {
        this.socket = socket;
        this.username = username;
        this.socket = socket;
        this.channelName = channelName;
        this.sid = this.socket.sid;
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