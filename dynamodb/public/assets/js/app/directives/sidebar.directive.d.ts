import { OnInit, ElementRef } from '@angular/core';
/**
 * Directive which trigger sidebar.
 *
 * @link semantic-ui.com/modules/sidebar.html
 */
export declare class SidebarDirective implements OnInit {
    private el;
    options: any;
    toggle: string;
    constructor(el: ElementRef);
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
}
