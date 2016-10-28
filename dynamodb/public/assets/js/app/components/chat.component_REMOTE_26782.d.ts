import { OnInit } from '@angular/core';
import { OnActivate } from '@angular/router';
import { TwilioService } from '../services/twilio.service';
export declare class ChatComponent implements OnInit, OnActivate {
    private twilio;
    isBusy: boolean;
    constructor(twilio: TwilioService);
    ngOnInit(): void;
    routerOnActivate(): void;
    /**
     * Sets the current channel for chatting.
     */
    setCurrentChannel(channel: any): void;
    /**
     * Loads the current list of all Channels the Client knows about.
     */
    private loadChannels();
    /**
     * Fired when a new Message has been added to the Channel.
     */
    private onMessageAdded(message);
    /**
     * Fired when a Member has joined the Channel.
     */
    private onMemberJoined(member);
    /**
     * Fired when a Member has left the Channel.
     */
    private onMemberLeft(member);
    /**
     * Fired when a Channel becomes visible to the Client.
     */
    private onChannelAdded(channel);
    /**
     * Fired when a Channel is no longer visible to the Client.
     */
    private onChannelRemoved(channel);
}
