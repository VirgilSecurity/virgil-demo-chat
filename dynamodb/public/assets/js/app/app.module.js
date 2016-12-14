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
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var app_component_1 = require('./components/app.component');
var login_component_1 = require('./components/login.component');
var chat_component_1 = require('./components/chat.component');
var from_now_pipe_1 = require('./pipes/from-now.pipe');
var tooltip_directive_1 = require('./directives/tooltip.directive');
var modal_directive_1 = require('./directives/modal.directive');
var scroll_into_view_directive_1 = require('./directives/scroll-into-view.directive');
var sidebar_directive_1 = require('./directives/sidebar.directive');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                chat_component_1.ChatComponent,
                from_now_pipe_1.FromNowPipe,
                tooltip_directive_1.TooltipDirective,
                modal_directive_1.ModalTriggerDirective,
                scroll_into_view_directive_1.ScrollIntoViewDirective,
                sidebar_directive_1.SidebarDirective
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map