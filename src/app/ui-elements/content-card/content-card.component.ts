import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'ui-content-card',
    templateUrl: './content-card.component.html',
    styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent implements OnInit {
    @Input() httpLoading = false;
    @Input() cardLoading = true;
    @Input() sectionTitle: string;
    @Input() helpMessage: string;
    @Input() editIconRouterLink: string;
    @Input() editIconTooltip: string;
    constructor() {
    }

    ngOnInit() {
    }

}
