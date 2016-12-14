import { VirgilService } from './virgil.service';
export declare class MessagingService {
    private virgilService;
    private socket;
    private adminPublicKey;
    username: string;
    constructor(virgilService: VirgilService);
    initialize(username: string): Promise<any>;
    getChannels(): Promise<Channel[]>;
    private initSocket();
    private loadAdminVirgilCard();
}
export declare class Channel {
    private socket;
    private username;
    private members;
    channelName: string;
    sid: string;
    publicKey: any;
    constructor(socket: any, username: string, channelName: string, publicKey: any);
    friendlyName: string;
    join(): Promise<any>;
    getMembers(): Promise<any>;
    sendMessage(msg: any): void;
    on(eventName: string, callback: (any) => void): void;
}
