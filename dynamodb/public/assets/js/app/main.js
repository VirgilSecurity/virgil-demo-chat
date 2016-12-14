///<reference path="../typings/index.d.ts" />
"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var app_component_1 = require('./components/app.component');
var account_service_1 = require('./services/account.service');
var messaging_service_1 = require('./services/messaging.service');
var virgil_service_1 = require('./services/virgil.service');
var backend_service_1 = require('./services/backend.service');
require('rxjs/add/operator/toPromise');
require('rxjs/add/operator/map');
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [http_1.HTTP_PROVIDERS, backend_service_1.BackendService, account_service_1.AccountService, messaging_service_1.MessagingService, virgil_service_1.VirgilService])
    .then(function (success) { return console.log('Bootstrap success'); })
    .catch(function (error) { return console.log(error); });
//# sourceMappingURL=main.js.map