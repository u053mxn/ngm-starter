import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FieldConfig} from '../../field.interface';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-button',
  template: `
    <div class="form-group-container" [formGroup]="group" [ngStyle]="{'justify-content': field.alignment}">
      <button type="submit" mat-raised-button color="primary" [disabled]="(field.disabled$ | async) || (field.loading$ | async)"
              [ngStyle]="{'width': field.width}">
        <app-loading-wrapper [isLoading]="field.loading$ | async" [spinnerSize]="2" [hideText]="true">{{field.label}}</app-loading-wrapper>
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
  @HostBinding('style.width') hostWidth: string;
  @HostBinding('style.grid-column-end') hostSpan: string;
  field: FormattedFieldConfig;
  group: FormGroup;

  constructor() {

  }

  ngOnInit() {
    this.field.width = this.field.width || '100%';
    this.hostWidth = this.field.rowWidth || '100%';
    this.hostSpan = `span ${this.field.columnSpan || 1}`;
  }
}
