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
var OffCanvasDirective = (function () {
    function OffCanvasDirective(el, window) {
        var mql = window.matchMedia('(max-width: 767px)');
        window.setTimeout(function () {
            mql.addListener(handleViewportChange);
            handleViewportChange(mql);
        }, 0);
        function handleViewportChange(mql) {
            if (mql.matches) {
                $(el.nativeElement)
                    .addClass('sidebar')
                    .sidebar('show')
                    .sidebar('attach events', '.sidebar .menu .item');
            }
            else {
            }
        }
    }
    OffCanvasDirective = __decorate([
        core_1.Directive({ selector: '[ipmOffCanvas]' }), 
        __metadata('design:paramtypes', [core_1.ElementRef, Window])
    ], OffCanvasDirective);
    return OffCanvasDirective;
}());
exports.OffCanvasDirective = OffCanvasDirective;
//# sourceMappingURL=off-canvas.directive.js.map