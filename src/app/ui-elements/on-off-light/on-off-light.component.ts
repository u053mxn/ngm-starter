import {Component, Input, OnInit} from '@angular/core';

export enum OnOffColor {
    RED,
    GREEN
}
@Component({
    selector: 'ui-on-off-light',
    templateUrl: './on-off-light.component.html',
    styleUrls: ['./on-off-light.component.scss']
})
export class OnOffLightComponent implements OnInit {
    @Input() off = true;
    @Input() color: OnOffColor = OnOffColor.GREEN;
    onOffColor = OnOffColor;
    constructor() {
    }

    ngOnInit() {
    }

}
