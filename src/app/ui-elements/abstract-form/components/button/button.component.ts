import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
    selector: 'ui-button',
    template: `
        <div class="form-group-container" [formGroup]="group" [ngStyle]="{'justify-content': field.alignment}">
            <button type="submit" mat-raised-button color="primary" [disabled]="(field.disabled | async) || (field.loading$ | async)"
                    [ngStyle]="{'width': field.width}"
                    [name]="field.name">
                <ui-loading-wrapper [isLoading]="field.loading$ | async" [spinnerSize]="2" [hideText]="true">{{field.label}}</ui-loading-wrapper>
            </button>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            align-items: center;
        }

        .form-group-container {
            width: 100%;
            display: flex;
            padding: 0.5em 0;
        }
    `]
})
export class ButtonComponent implements OnInit {
    field: FormattedFieldConfig;
    group: FormGroup;

    constructor() {

    }

    ngOnInit() {
    }
}
