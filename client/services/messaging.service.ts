import { Injectable } from '@angular/core'

declare var io: any;
const channelNames = [ 'general' ];

@Injectable()
export class MessagingService {

    private socket: any;
    public username: string;

    initialize (username: string) {
        return new Promise((resolve, reject) => {
            this.username = username;
            this.socket = io();
            this.socket.on('connect', () => {
                resolve(null);
            });
            this.socket.on('connect_error', (err) => {
                reject(err);
            })
        });
    }
    
    getChannels (): Promise<Channel[]> {
        return Promise.resolve(channelNames.map(channelName => new Channel(this.socket, this.username, channelName)));
    }


}

export class Channel {
    
    private members: string[];
    
    public channelName:string;
    public sid:string;
    
    constructor(private socket:any, private username:string, channelName:string) {
        this.socket = socket;
        this.channelName = channelName;
        this.sid = this.socket.sid;
    }

    get friendlyName(): string {
        return this.channelName;
    }
    
    join (): Promise<any> {
        return new Promise((resolve) => {
            this.socket.emit('joinChannel', this.username);
            
            this.socket.on('joinedChannel', (data) => {
                this.members = data.members;
                resolve(null);
            })
        });
    }
    
    getMembers (): Promise<any> {
        return Promise.resolve(this.members);
    }
    
    sendMessage (data: string) {
        this.socket.emit('newMessage', data);
    }

    on (eventName: string, callback: (any) => void) {
        this.socket.on(eventName, callback);
    }
}
