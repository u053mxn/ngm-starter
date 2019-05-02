import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'ui-checkbox',
  template: `
    <div class="form-group-container" [formGroup]="group">
      <mat-checkbox class="form-item" [formControlName]="field.name"
                    [ngStyle]="{'width': field.width, 'justify-content': field.alignment}">{{field.label}}</mat-checkbox>
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
