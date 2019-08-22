import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'ui-dotted-vertical-separator',
    templateUrl: './dotted-vertical-separator.component.html',
    styleUrls: ['./dotted-vertical-separator.component.scss']
})
export class DottedVerticalSeparatorComponent implements OnInit {
    @Input() top = '';
    @Input() bottom = '';

    constructor() {
    }

    ngOnInit() {
    }

}
