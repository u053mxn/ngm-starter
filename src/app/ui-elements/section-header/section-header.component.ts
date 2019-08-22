import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'ui-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {
    @Input() editIconTooltip: string;
    @Input() editIconRouterLink: string;
    @Input() helpMessage: string;
    constructor() {
    }

    ngOnInit() {
    }

}
