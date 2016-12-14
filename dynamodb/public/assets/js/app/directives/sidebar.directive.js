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
/**
 * Directive which trigger sidebar.
 *
 * @link semantic-ui.com/modules/sidebar.html
 */
var SidebarDirective = (function () {
    function SidebarDirective(el) {
        this.el = el;
    }
    SidebarDirective.prototype.ngOnInit = function () {
        if (typeof jQuery === 'undefined') {
            console.log('jQuery is not loaded');
            return;
        }
        var options = this.options || {};
        if (options.context) {
            options.context = jQuery(options.context);
        }
        var $sidebar = jQuery(this.el.nativeElement).sidebar(options);
        if (this.toggle) {
            $sidebar.sidebar('attach events', this.toggle);
        }
    };
    SidebarDirective.prototype.onClick = function (event) {
        var $el = jQuery(this.el.nativeElement);
        var $target = jQuery(event.target);
        if ($el.is('.menu') && $target.is('a.item')) {
            $el.sidebar('hide');
        }
    };
    SidebarDirective = __decorate([
        core_1.Directive({
            host: {
                '(click)': 'onClick($event)'
            },
            inputs: [
                'options: ipmSidebar',
                'toggle: ipmSidebarToggle'
            ],
            selector: '[ipmSidebar]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SidebarDirective);
    return SidebarDirective;
}());
exports.SidebarDirective = SidebarDirective;
//# sourceMappingURL=sidebar.directive.js.map