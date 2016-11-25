import * as _ from 'lodash';
import { Injectable } from '@angular/core'
import { VirgilService } from './virgil.service';

declare var io: any;
declare var virgil: any;

const channelNames = [ 'general' ];

@Injectable()
export class MessagingService {

    private socket: any;
    private adminPublicKey: any;
    public username: string;

    constructor (private virgilService: VirgilService) { }

    initialize (username: string) {
      this.username = username;

      return Promise.all([
        this.initSocket(),
        this.loadAdminVirgilCard()
      ]).then(results => {
        let adminCard = results[1];
        if (adminCard) {
          this.adminPublicKey = this.virgilService.crypto.importPublicKey(adminCard.publicKey);
        } else {
          this.adminPublicKey = null;
        }
        return null;
      });
    }

    getChannels (): Promise<Channel[]> {
        return Promise.resolve(channelNames.map(
            channelName => new Channel(this.socket, this.username, channelName, this.adminPublicKey)));
    }


    private initSocket () {
      return new Promise((resolve, reject) => {
        this.socket = io();
        this.socket.on('connect', () => {
          resolve(null);
        });
        this.socket.on('connect_error', (err) => {
          reject(err);
        })
      });
    }

    private loadAdminVirgilCard () {
      return this.virgilService.client.searchCards({
        identities: [ 'ip_messaging_chat_admin' ]
      }).then(cards => _.last(_.sortBy(cards, 'createdAt')))
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
