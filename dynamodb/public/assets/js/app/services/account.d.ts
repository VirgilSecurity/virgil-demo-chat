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
