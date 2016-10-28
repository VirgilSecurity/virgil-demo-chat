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
var ScrollIntoViewDirective = (function () {
    function ScrollIntoViewDirective(el) {
        this.el = el;
    }
    Object.defineProperty(ScrollIntoViewDirective.prototype, "ipmScrollIf", {
        set: function (cond) {
            var _this = this;
            this.condition = cond || false;
            if (this.condition) {
                setTimeout(function () { return _this.el.nativeElement.scrollIntoView(false); }, 100);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], ScrollIntoViewDirective.prototype, "ipmScrollIf", null);
    ScrollIntoViewDirective = __decorate([
        core_1.Directive({
            selector: '[ipmScrollIntoView]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], ScrollIntoViewDirective);
    return ScrollIntoViewDirective;
}());
exports.ScrollIntoViewDirective = ScrollIntoViewDirective;
//# sourceMappingURL=scroll-into-view.directive.js.map