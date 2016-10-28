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
var ChatComponent = (function () {
    function ChatComponent(twilio) {
        this.twilio = twilio;
        // messages = [];
        // channels = [];
        // currentChannel: any; 
        this.isBusy = false;
        // this.twilio.client.on('channelAdded', this.onChannelAdded);
        // this.twilio.client.on('channelRemoved', this.onChannelRemoved);
        //console.log('pipka');
        //this.loadChannels();
        //this.isBusy = true;
    }
    ChatComponent.prototype.ngOnInit = function () {
        console.log('pipka');
        //this.loadChannels();
    };
    ChatComponent.prototype.routerOnActivate = function () {
        console.log('pipka1');
        this.isBusy = true;
    };
    /**
     * Sets the current channel for chatting.
     */
    ChatComponent.prototype.setCurrentChannel = function (channel) {
        // if (this.currentChannel != null){
        //     this.currentChannel.removeListener('memberJoined', this.onMemberJoined);
        //     this.currentChannel.removeListener('memberLeft', this.onMemberLeft);
        //     this.currentChannel.removeListener('messageAdded', this.onMessageAdded);
        // }
        // this.currentChannel = channel;
        // this.currentChannel.on('memberJoined', this.onMemberJoined);
        // this.currentChannel.on('memberLeft', this.onMemberLeft);
        // this.currentChannel.on('messageAdded', this.onMessageAdded);
    };
    /**
     * Loads the current list of all Channels the Client knows about.
     */
    ChatComponent.prototype.loadChannels = function () {
        this.isBusy = true;
        // this.cd.markForCheck();    
        // this.twilio.client.getChannels().then(channels => {
        //         channels.forEach(channel => {
        //             this.onChannelAdded(channel);                        
        //         });  
        //         this.isBusy = false;   
        //         // this.cd.markForCheck();           
        //         this.cd.detectChanges();     
        //     })
        //     .catch(error => this.do(() => {
        //         this.isBusy = false;                
        //         console.error(error);
        //     }));     
    };
    /**
     * Fired when a new Message has been added to the Channel.
     */
    ChatComponent.prototype.onMessageAdded = function (message) {
    };
    /**
     * Fired when a Member has joined the Channel.
     */
    ChatComponent.prototype.onMemberJoined = function (member) {
    };
    /**
     * Fired when a Member has left the Channel.
     */
    ChatComponent.prototype.onMemberLeft = function (member) {
    };
    /**
     * Fired when a Channel becomes visible to the Client.
     */
    ChatComponent.prototype.onChannelAdded = function (channel) {
        //this.channels.push(channel);        
        //console.log('Channel '+ channel.friendlyName + ' has been added.');
    };
    /**
     * Fired when a Channel is no longer visible to the Client.
     */
    ChatComponent.prototype.onChannelRemoved = function (channel) {
    };
    ChatComponent = __decorate([
        core_1.Component({
            selector: 'ipm-chat',
            templateUrl: './assets/views/chat.component.html',
            directives: [common_1.NgClass]
        }), 
        __metadata('design:paramtypes', [Object])
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component_BACKUP_26782.js.map