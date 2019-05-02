import {Component, EventEmitter, HostBinding, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';
import {isObservable, Observable} from 'rxjs';
import {SelectionChange, SelectionChangeResponse, SelectOptions} from '../../field.interface';

@Component({
  selector: 'ui-select',
  template: `
    <mat-form-field class="dynamic-form-field" [formGroup]="group" [ngStyle]="{'width': field.width}">
      <mat-select [placeholder]="field.label" [formControlName]="field.name"
                  (selectionChange)="selection(field.selectionChange ? field.selectionChange($event.value.id) : null)"
                  [disableControl]="disableControl()">

        <mat-option *ngFor="let item of options" [value]="item">{{item.label}}</mat-option>

      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }
  `]
})
export class SelectComponent implements OnInit {
  @HostBinding('style.width') hostWidth: string;
  @HostBinding('style.grid-column-end') hostSpan: string;
  @Output() selected = new EventEmitter<SelectionChange>();

  field: FormattedFieldConfig;
  group: FormGroup;

  options: SelectOptions[];

  constructor() {

  }

  ngOnInit() {
    this.field.width = this.field.width || '100%';
    this.hostWidth = this.field.rowWidth || '100%';
    this.hostSpan = `span ${this.field.columnSpan || 1}`;
    this.setOptions();
  }

  setOptions() {
    if (!this.isObservable(this.field.options)) {
      this.options = this.field.options as SelectOptions[];
    } else {
      (this.field.options as Observable<SelectOptions[]>).subscribe(options => {
        this.options = options;
      });
    }
  }

  disableControl() {
    const isParentField = (!!this.field.disableInSequence && !!this.field.disableInSequence.parentFieldName);
    return isParentField && (!(this.group.controls[this.field.disableInSequence.parentFieldName].value) || !this.options || this.options.length === 0);
  }

  isObservable(val: any): boolean {
    return isObservable(val);
  }

  selection(changeResponse: SelectionChangeResponse) {
    if (!!changeResponse) {
      changeResponse.options$.subscribe(options => {
        this.field.selectionEvent.emit({options: options, targetField: changeResponse.targetField});
      });
    }
  }
}
