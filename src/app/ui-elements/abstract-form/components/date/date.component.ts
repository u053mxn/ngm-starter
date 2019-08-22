import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'ui-date',
  template: `
    <mat-form-field class="dynamic-form-field" [formGroup]="group" [ngStyle]="{'width': field.width}">
      <input matInput [matDatepicker]="picker" [formControlName]="field.name" [placeholder]="field.label" [name]="field.name">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <mat-hint></mat-hint>
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }
  `]
})
export class DateComponent implements OnInit {
  field: FormattedFieldConfig;
  group: FormGroup;

  constructor() {

  }

  ngOnInit() {
  }
}
