export declare class Account {
    id: string;
    identity: string;
    identityType: string;
    publicKey: Object;
    privateKey: Object;
    constructor(id: string, identity: string, identityType: string, publicKey: Object, privateKey: Object);
    toJSON(): string;
    static fromJson(json: string): Account;
}
export declare class AccountService {
    constructor();
    private currentAccount;
    current: Account;
    hasAccount(): string;
    setCurrentAccount(account: Account): void;
    logout(): void;
    private storeAccount(storeAccount);
    private loadAccount();
}
