import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'ui-back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    back() {
        window.history.back();
    }
}
