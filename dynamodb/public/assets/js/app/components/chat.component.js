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
var common_1 = require('@angular/common');
var messaging_service_1 = require('../services/messaging.service');
var backend_service_1 = require('../services/backend.service');
var account_service_1 = require('../services/account.service');
var virgil_service_1 = require('../services/virgil.service');
var from_now_pipe_1 = require('../pipes/from-now.pipe');
var tooltip_directive_1 = require('../directives/tooltip.directive');
var modal_directive_1 = require('../directives/modal.directive');
var scroll_into_view_directive_1 = require('../directives/scroll-into-view.directive');
var sidebar_directive_1 = require('../directives/sidebar.directive');
var _ = require('lodash');
var Buffer = virgil_service_1.VirgilService.VirgilSDK.Buffer;
var ChatComponent = (function () {
    function ChatComponent(account, messaging, backend, virgil, cd) {
        this.account = account;
        this.messaging = messaging;
        this.backend = backend;
        this.virgil = virgil;
        this.cd = cd;
        this.messages = [];
        this.channels = [];
        this.channelMembers = [];
        this.isChannelsLoading = false;
        this.isChannelHistoryLoading = false;
        this.includeChannelHistory = true;
        this.createChannel = _.noop;
    }
    ChatComponent.prototype.ngOnInit = function () {
        this.loadChannels();
    };
    /**
     * Deletes current channel.
     */
    ChatComponent.prototype.deleteChannel = function () {
        var _this = this;
        _.remove(this.channels, function (ch) { return ch.sid == _this.currentChannel.sid; });
        this.currentChannel.delete();
        this.currentChannel = null;
        this.cd.detectChanges();
    };
    /**
     * Sets the current channel for chatting.
     */
    ChatComponent.prototype.setCurrentChannel = function (channel) {
        if (channel == this.currentChannel) {
            return;
        }
        console.log("Channel Selected", channel);
        this.channelMembers = [];
        this.messages = [];
        this.currentChannel = channel;
        this.currentChannel.historyLoaded = false;
        this.cd.detectChanges();
        this.initializeChannel(channel);
    };
    /**
     * Initializes the currently selected channel.
     */
    ChatComponent.prototype.initializeChannel = function (channel) {
        var _this = this;
        this.memberJoinedHandler = this.onMemberJoined.bind(this);
        this.memberLeftHandler = this.onMemberLeft.bind(this);
        this.messageAddedHandler = this.onMessageAdded.bind(this);
        channel.join().then(function () {
            // subscribe for channel events.            
            channel.on('memberJoined', _this.memberJoinedHandler);
            channel.on('memberLeft', _this.memberLeftHandler);
            channel.on('messageAdded', _this.messageAddedHandler);
            // load channel members.        
            return channel.getMembers();
        }).then(function (members) {
            return Promise.all(members.map(function (m) { return _this.addMember(m); }));
        }).then(function () {
            _this.cd.detectChanges();
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    /**
     * Loads history from backend service.
     */
    ChatComponent.prototype.loadHistory = function () {
        var _this = this;
        var identity = this.account.current.identity;
        var channelSid = this.currentChannel.sid;
        this.isChannelHistoryLoading = true;
        this.backend.getHistory(identity, channelSid).then(function (messages) {
            var encryptedMessages = _.sortBy(messages, 'dateUpdated');
            _.forEach(encryptedMessages, function (m) { return _this.onMessageAdded(m); });
            _this.isChannelHistoryLoading = false;
            _this.currentChannel.historyLoaded = true;
            _this.cd.detectChanges();
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    /**
     * Loads the current list of all Channels the Client knows about.
     */
    ChatComponent.prototype.loadChannels = function () {
        var _this = this;
        this.isChannelsLoading = true;
        this.cd.detectChanges();
        this.messaging.getChannels().then(function (channels) {
            channels.forEach(function (channel) {
                _this.onChannelAdded(channel);
            });
            _this.isChannelsLoading = false;
            _this.cd.detectChanges();
        })
            .catch(this.handleError);
    };
    /**
     * Encrypts & posts the new message to current channel.
     */
    ChatComponent.prototype.postMessage = function () {
        var messageString = this.newMessage;
        var recipients = [];
        this.channelMembers.forEach(function (m) {
            recipients.push(m.publicKey);
        });
        var message = {
            body: messageString,
            date: Date.now(),
            author: this.account.current.identity,
            id: this.generateUUID()
        };
        this.newMessage = '';
        this.messages.push(message);
        var messageBuf = new Buffer(messageString);
        var encryptedMessage = _.assign({}, message, {
            body: this.virgil.crypto.encrypt(messageBuf, recipients)
        });
        this.currentChannel.sendMessage(encryptedMessage);
    };
    /**
     * Loads the member's public key and the member to the current member collection.
     */
    ChatComponent.prototype.addMember = function (member) {
        var _this = this;
        return this.virgil.client.searchCards({
            identities: [member.identity],
            type: 'chat_member'
        }).then(function (result) {
            var latestCard = _.last(_.sortBy(result, 'createdAt'));
            if (latestCard) {
                member.publicKey = _this.virgil.crypto.importPublicKey(latestCard.publicKey);
            }
            _this.channelMembers.push(member);
            return member;
        });
    };
    /**
     * Fired when a new Message has been added to the Channel.
     */
    ChatComponent.prototype.onMessageAdded = function (message) {
        debugger;
        var privateKey = this.account.current.privateKey;
        var encryptedBuffer = new Buffer(message.body, "base64");
        var messageObject = _.assign({}, message, {
            body: this.virgil.crypto.decrypt(encryptedBuffer, privateKey).toString('utf8')
        });
        if (_.some(this.messages, function (m) { return m.id == messageObject.id; })) {
            return;
        }
        console.log('Encrypted Message Received', message);
        this.messages.push(messageObject);
        this.cd.detectChanges();
    };
    /**
     * Fired when a Member has joined the Channel.
     */
    ChatComponent.prototype.onMemberJoined = function (member) {
        var _this = this;
        this.addMember(member).then(function () {
            _this.cd.detectChanges();
        });
    };
    /**
     * Fired when a Member has left the Channel.
     */
    ChatComponent.prototype.onMemberLeft = function (member) {
        _.remove(this.channelMembers, function (m) { return m.sid == member.sid; });
        this.cd.detectChanges();
    };
    /**
     * Fired when a Channel becomes visible to the Client.
     */
    ChatComponent.prototype.onChannelAdded = function (channel) {
        if (_.some(this.channels, function (c) { return c.sid == channel.sid; })) {
            return;
        }
        this.channels.push(channel);
        this.cd.detectChanges();
    };
    /**
     * Handles an chat errors.
     */
    ChatComponent.prototype.handleError = function (error) {
        this.isChannelHistoryLoading = false;
        this.isChannelsLoading = false;
        this.cd.detectChanges();
        console.error(error);
    };
    ChatComponent.prototype.generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], ChatComponent.prototype, "logout", void 0);
    ChatComponent = __decorate([
        core_1.Component({
            selector: 'ipm-chat',
            templateUrl: './assets/views/chat.component.html',
            directives: [
                common_1.NgClass,
                tooltip_directive_1.TooltipDirective,
                modal_directive_1.ModalTriggerDirective,
                scroll_into_view_directive_1.ScrollIntoViewDirective,
                sidebar_directive_1.SidebarDirective
            ],
            pipes: [from_now_pipe_1.FromNowPipe]
        }), 
        __metadata('design:paramtypes', [account_service_1.AccountService, messaging_service_1.MessagingService, backend_service_1.BackendService, virgil_service_1.VirgilService, core_1.ChangeDetectorRef])
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map