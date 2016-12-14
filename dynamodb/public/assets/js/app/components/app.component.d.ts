import { OnInit, ChangeDetectorRef } from '@angular/core';
import { VirgilService } from '../services/virgil.service';
import { MessagingService } from '../services/messaging.service';
import { BackendService } from '../services/backend.service';
import { AccountService } from '../services/account.service';
export declare class AppComponent implements OnInit {
    private virgil;
    private messaging;
    private account;
    private backend;
    private cd;
    loginCallback: Function;
    logoutCallback: Function;
    constructor(virgil: VirgilService, messaging: MessagingService, account: AccountService, backend: BackendService, cd: ChangeDetectorRef);
    isReady: boolean;
    isLoggedIn: boolean;
    ngOnInit(): void;
    authenticate(nickName: string): Promise<any>;
    initializeServices(identity: string): Promise<any>;
    onLogin(nickName: string): void;
    onLogout(): void;
    private createCard(username);
}
