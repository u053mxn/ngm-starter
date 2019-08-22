import {AfterContentInit, Component, ContentChild, HostBinding, OnInit} from '@angular/core';
import {DynamicFieldDirective} from '../dynamic-field/dynamic-field.directive';

@Component({
    selector: 'ui-parent-field',
    template: '<ng-content></ng-content>',
    styles: [`
        :host {
            width: 100%;
        }
    `]
})
export class ParentFieldComponent implements OnInit, AfterContentInit {
    @ContentChild(DynamicFieldDirective) dynamicField: DynamicFieldDirective;
    @HostBinding('style.width') hostWidth: string;
    @HostBinding('style.grid-column-end') hostSpan: string;
    @HostBinding('style.-ms-grid-column') hostMsGridColumnStart: string;
    @HostBinding('style.-ms-grid-column-span') hostMsGridColumnSpan: string;
    @HostBinding('style.-ms-grid-row') hostMsGridRow: string;
    @HostBinding('style.padding') hostMsGridGap: string;
    @HostBinding('style.grid-column-start') hostColumnStart: string;

    constructor() {
    }

    ngOnInit() {

    }

    ngAfterContentInit(): void {
        this.hostWidth = this.dynamicField.field.rowWidth || '100%';
        this.setColumnSpan();
    }

    setColumnSpan() {
        this.dynamicField.field.columnSpanEmitter.asObservable().subscribe(cs => {
            this.hostSpan = `span ${cs.hostSpan || this.dynamicField.field.columnSpan || 1}`;
            if (!!cs.hostColumnStart) {
                this.hostColumnStart = `${cs.hostMsColumnStart || 1}`;
            }
            if (cs.isIe) {
                this.hostMsGridColumnSpan = `${cs.hostMsColumnSpan || this.dynamicField.field.columnSpan || 1}`;
                this.hostMsGridColumnStart = `${cs.hostMsColumnStart || 1}`;
                this.hostMsGridRow = `${cs.hostMsGridRow || 1}`;
                this.hostMsGridGap = cs.hostMsGridGap;
            }
        });
    }
}
