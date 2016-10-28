import { Http } from '@angular/http';
import { VirgilService } from './virgil.service';
export declare class BackendService {
    private http;
    private virgilService;
    private appPublicKey;
    constructor(http: Http, virgilService: VirgilService);
    /**
     * Gets a validation token for Virgil services.
     */
    auth(identity: string, publicKey?: string): Promise<any>;
    /**
     * Gets an access token for Virgil services.
     * */
    getVirgilConfig(): Promise<any>;
    /**
     * Gets decrypted history with current account's private key.
     */
    getHistory(identity: string, channelSid: string): Promise<any>;
    /**
     * Sets the Application Public Key, uses to prevent men-in-the-middle attacks.
     */
    setAppPublicKey(publicKey: Object): void;
    /**
     * Gets an application's Public Key.
     */
    AppPublicKey: Object;
    createVirgilCard(request: Object): Promise<any>;
    private postJson(url, data);
    /**
     * Verifies response using application's Public Key.
     */
    private verifyAndMapToJson(response);
}
