import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'ui-section-text',
    template: `
        <h5 class="text"><ng-content></ng-content></h5>
        <ui-fa-icon-circle class='info-icon' *ngIf="tooltipMessage" [faIconArray]="iconArray" [tooltipMessage]="tooltipMessage"></ui-fa-icon-circle>`,
    styles: [`
        :host {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .text {
            color: #191919;
        }
        .info-icon {
            font-size: 70%;
        }
    `]
})
export class SectionTextComponent implements OnInit {
    @Input() tooltipMessage;
    iconArray = ['fas', 'info'];
    constructor() {
    }

    ngOnInit() {
    }

}
