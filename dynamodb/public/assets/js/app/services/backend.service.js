"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var virgil_service_1 = require('./virgil.service');
var Buffer = virgil_service_1.VirgilService.VirgilSDK.Buffer;
var BackendService = (function () {
    function BackendService(http, virgilService) {
        this.http = http;
        this.virgilService = virgilService;
    }
    /**
     * Gets a validation token for Virgil services.
     */
    BackendService.prototype.auth = function (identity, publicKey) {
        var _this = this;
        var body = JSON.stringify({ identity: identity, public_key: publicKey });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post("/auth/login", body, options)
            .toPromise().then(function (r) { return _this.verifyAndMapToJson(r); });
    };
    /**
     * Gets an access token for Virgil services.
     * */
    BackendService.prototype.getVirgilConfig = function () {
        return this.http.get('/virgil-config')
            .toPromise()
            .then(function (r) { return Promise.resolve(r.json()); });
    };
    /**
     * Gets decrypted history with current account's private key.
     */
    BackendService.prototype.getHistory = function (identity, channelSid) {
        var _this = this;
        return this.http.get("/history?identity=" + identity + "&channelSid=" + channelSid)
            .toPromise().then(function (r) { return _this.verifyAndMapToJson(r); });
    };
    /**
     * Sets the Application Public Key, uses to prevent men-in-the-middle attacks.
     */
    BackendService.prototype.setAppPublicKey = function (publicKey) {
        this.appPublicKey = publicKey;
    };
    Object.defineProperty(BackendService.prototype, "AppPublicKey", {
        /**
         * Gets an application's Public Key.
         */
        get: function () {
            return this.appPublicKey;
        },
        enumerable: true,
        configurable: true
    });
    BackendService.prototype.createVirgilCard = function (request) {
        return this.postJson('/register', request).then(this.verifyAndMapToJson.bind(this));
    };
    BackendService.prototype.postJson = function (url, data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options).toPromise();
    };
    /**
     * Verifies response using application's Public Key.
     */
    BackendService.prototype.verifyAndMapToJson = function (response) {
        var responseSignBase64 = response.headers.get('x-ipm-response-sign');
        if (!responseSignBase64) {
            return Promise.resolve(response.json());
        }
        var responseSign = new Buffer(responseSignBase64, 'base64');
        var isValid = this.virgilService.crypto.verify(new Buffer(response.text()), responseSign, this.AppPublicKey);
        if (!isValid) {
            throw "Response signature is not valid.";
        }
        return Promise.resolve(response.json());
    };
    BackendService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, virgil_service_1.VirgilService])
    ], BackendService);
    return BackendService;
}());
exports.BackendService = BackendService;
//# sourceMappingURL=backend.service.js.map