import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
    selector: 'ui-checkbox',
    template: `
        <div class="form-group-container" [formGroup]="group">
            <mat-checkbox class="form-item" [formControlName]="field.name"
                          [ngStyle]="{'width': field.width, 'justify-content': field.alignment}"
                          [name]="field.name">
                {{field.label}}
            </mat-checkbox>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            align-items: center;
        }

        .form-group-container {
            width: 100%;
            padding: 0.5em 0;
        }

        .form-item {
            width: 100%;
            display: flex;
        }
    `]
})
export class CheckboxComponent implements OnInit {
    field: FormattedFieldConfig;
    group: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }
}
