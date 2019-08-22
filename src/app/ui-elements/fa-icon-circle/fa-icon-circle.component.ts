import {Component, Input, OnInit} from '@angular/core';
import {UiUtility} from '../ui-utility-functions';
import getRandomInteger = UiUtility.getRandomInteger;

@Component({
    selector: 'ui-fa-icon-circle',
    templateUrl: './fa-icon-circle.component.html',
    styleUrls: ['./fa-icon-circle.component.scss']
})
export class FaIconCircleComponent implements OnInit {
    @Input() tooltipMessage = 'Test';
    @Input() href;
    @Input() linkId = this.getRandomId();
    @Input() faIconArray = ['fas', 'question'];

    constructor() {
    }

    ngOnInit() {
    }

    private getRandomId() {
        return `fa-icon-${getRandomInteger(10000, 99999)}`;
    }
}
