export declare class MessagingService {
    private socket;
    username: string;
    initialize(username: string): Promise<{}>;
    getChannels(): Promise<Channel[]>;
}
export declare class Channel {
    private socket;
    private username;
    private members;
    channelName: string;
    sid: string;
    constructor(socket: any, username: string, channelName: string);
    friendlyName: string;
    join(): Promise<any>;
    getMembers(): Promise<any>;
    sendMessage(msg: any): void;
    on(eventName: string, callback: (any) => void): void;
}
