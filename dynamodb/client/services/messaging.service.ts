import { Injectable } from '@angular/core'
import { VirgilService } from './virgil.service';

declare var io: any;
declare var virgil: any;
const channelNames = [ 'general' ];
const adminPublicKeyRaw = new VirgilService.VirgilSDK.Buffer('MCowBQYDK2VwAyEARkfYKBTx+CONAJJWJFsPfpFVamgq03CuHKs8LPxZ8yc=', 'base64');

@Injectable()
export class MessagingService {

    private socket: any;
    private adminPublicKey: any;
    public username: string;

    constructor () {
        this.adminPublicKey = VirgilService.Crypto.importPublicKey(adminPublicKeyRaw);
    }

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
        return Promise.resolve(channelNames.map(
            channelName => new Channel(this.socket, this.username, channelName, this.adminPublicKey)));
    }


}

export class Channel {
    
    private members: string[];
    
    public channelName:string;
    public sid:string;
    public publicKey:any;
    
    constructor(private socket:any, private username:string, channelName:string, publicKey:any) {
        this.socket = socket;
        this.channelName = channelName;
        this.sid = this.socket.sid;
        this.publicKey = publicKey;
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
    
    sendMessage (msg: any) {
        this.socket.emit('newMessage', msg);
    }

    on (eventName: string, callback: (any) => void) {
        this.socket.on(eventName, callback);
    }
}
