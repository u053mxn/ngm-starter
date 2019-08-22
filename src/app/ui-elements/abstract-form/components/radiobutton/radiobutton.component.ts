import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'ui-radiobutton',
  template: `
    <div [formGroup]="group" class="form-group-container" [ngStyle]="{'justify-content': field.alignment}">
      <label class="radio-label-padding">{{field.label}}:</label>
      <mat-radio-group [formControlName]="field.name" class="radio-group" [name]="field.name">
        <mat-radio-button class="radio-button" *ngFor="let item of field.options" [value]="item">{{item}}</mat-radio-button>
      </mat-radio-group>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }

    .radio-group {
      display: flex;
      flex-wrap: nowrap;
    }

    .radio-label-padding {
      padding-right: 1em;
    }

    .radio-button:not(:last-child) {
      padding-right: 1em;
    }

    .form-group-container {
      width: 100%;
      display: flex;
    }
  `]
})
export class RadiobuttonComponent implements OnInit {
  field: FormattedFieldConfig;
  group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}
