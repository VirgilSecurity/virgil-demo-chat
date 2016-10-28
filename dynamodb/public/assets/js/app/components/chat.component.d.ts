import { OnInit, ChangeDetectorRef } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { BackendService } from '../services/backend.service';
import { AccountService } from '../services/account.service';
import { VirgilService } from '../services/virgil.service';
export declare class ChatComponent implements OnInit {
    account: AccountService;
    private messaging;
    private backend;
    private virgil;
    private cd;
    logout: Function;
    messages: any[];
    channels: any[];
    channelMembers: any[];
    currentChannel: any;
    isChannelsLoading: boolean;
    isChannelHistoryLoading: boolean;
    newChannelName: string;
    includeChannelHistory: boolean;
    newMessage: string;
    createChannel: Function;
    private memberJoinedHandler;
    private memberLeftHandler;
    private messageAddedHandler;
    constructor(account: AccountService, messaging: MessagingService, backend: BackendService, virgil: VirgilService, cd: ChangeDetectorRef);
    ngOnInit(): void;
    /**
     * Deletes current channel.
     */
    deleteChannel(): void;
    /**
     * Sets the current channel for chatting.
     */
    setCurrentChannel(channel: any): void;
    /**
     * Initializes the currently selected channel.
     */
    initializeChannel(channel: any): void;
    /**
     * Loads history from backend service.
     */
    loadHistory(): void;
    /**
     * Loads the current list of all Channels the Client knows about.
     */
    private loadChannels();
    /**
     * Encrypts & posts the new message to current channel.
     */
    postMessage(): void;
    /**
     * Loads the member's public key and the member to the current member collection.
     */
    private addMember(member);
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
     * Handles an chat errors.
     */
    private handleError(error);
    private generateUUID();
}
