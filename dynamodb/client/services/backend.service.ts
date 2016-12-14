import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { VirgilService } from './virgil.service'

const Buffer = VirgilService.VirgilSDK.Buffer;

@Injectable()
export class BackendService {

    private appPublicKey: Object;

    constructor(private http: Http, private virgilService: VirgilService) {}

    /**
     * Gets a validation token for Virgil services.
     */
    public auth(identity: string, publicKey?: string): Promise<any> {
        let body = JSON.stringify({ identity: identity, public_key: publicKey });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post("/auth/login", body, options)
            .toPromise().then(r => this.verifyAndMapToJson(r));
    }

    /**
     * Gets an access token for Virgil services.
     * */
    public getVirgilConfig(): Promise<any> {
        return this.http.get('/virgil-config')
            .toPromise()
            .then(r => Promise.resolve(r.json()));
    }

    /**
     * Gets decrypted history with current account's private key.
     */
    public getHistory(identity:string, channelName: string): Promise<any> {
        return this.http.get(`/history?identity=${identity}&channelName=${channelName}`)
            .toPromise().then(r => this.verifyAndMapToJson(r));
    }

    /**
     * Sets the Application Public Key, uses to prevent men-in-the-middle attacks.
     */
    public setAppPublicKey(publicKey: Object) {
        this.appPublicKey = publicKey;
    }

    /**
     * Gets an application's Public Key.
     */
    public get AppPublicKey(): Object {
        return this.appPublicKey;
    }

    public createVirgilCard(request: Object): Promise<any> {
        return this.postJson('/register', { card_request: request }).then(this.verifyAndMapToJson.bind(this));
    }

    private postJson(url: string, data: Object): Promise<any> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options).toPromise();
    }

    /**
     * Verifies response using application's Public Key.
     */
    private verifyAndMapToJson(response:Response): Promise<any>{
        let responseSignBase64 = response.headers.get('x-ipm-response-sign');
        if (!responseSignBase64) {
            return Promise.resolve(response.json());
        }

        let responseSign = new Buffer(responseSignBase64, 'base64');
        let isValid = this.virgilService.crypto.verify(
            new Buffer(response.text()),
            responseSign,
            this.AppPublicKey);

        if (!isValid){
            throw "Response signature is not valid."
        }

        return Promise.resolve(response.json());
    }
}
