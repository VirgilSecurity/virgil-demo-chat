import { BackendService } from './backend.service';
export declare class TwilioService {
    private backend;
    private accessManager;
    client: any;
    constructor(backend: BackendService);
    initialize(accessToken: string): void;
}
