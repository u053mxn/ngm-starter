import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldConfig} from '../../field.interface';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  template: `
    <form #formElement class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)"
          [ngStyle]="{
          'grid-template-columns': 'repeat(' + columns + ', 1fr)',
          'grid-column-gap': gridColumnGap,
          'grid-row-gap': gridRowGap}">
      <ng-container *ngFor="let field of formattedFields;" dynamicField [field]="field" [group]="form">
      </ng-container>
    </form>
  `,
  styles: [`
    .dynamic-form {
      width: 100%;
      display: grid;
      justify-items: start;
      grid-column-gap: 1em;
    }

  `]
})
export class DynamicFormComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;
  @Input() fields: FieldConfig[] = [];
  @Input() verticalAlign = false;
  @Input() columns = 2;
  @Input() gridColumnGap = '1em';
  @Input() gridRowGap = '0em';

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  resizeSub: Subscription;
  formattedFields: FormattedFieldConfig[] = [];
  get value() {
    return this.form.value;
  }

  constructor(private fb: FormBuilder, private el: ElementRef) {
  }

  ngOnInit() {
    this.onInit();
    this.form = this.createControl();
    // throttle resize events
    this.resizeSub = fromEvent(window, 'resize').pipe(
      throttleTime(500)
    ).subscribe(() => {
      this.onInit();
    });
  }
  onInit() {
    const w = this.formElement.nativeElement.offsetWidth;
    console.log(w);
    if ( w < 500) {
      this.columns = 1;
    } else if (w >= 500 && w < 1000) {
      this.columns = 2;
    } else {
      this.columns = 3;
    }
    this.formattedFields = [];
    for (let i = 0; i < this.fields.length; i++) {
      const f = this.fields[i];
      const csf = f.columnSpanFraction;
      const ff: FormattedFieldConfig = Object.create(f);
      if (!!csf && csf <= 1 && csf > 0) {
        ff.columnSpan = Math.ceil(this.columns * (f.columnSpanFraction || 1));
      }
      this.formattedFields.push(ff);
    }
  }
  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === 'button') {
        return;
      }
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validations || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({onlySelf: true});
    });
  }
}

export interface FormattedFieldConfig extends FieldConfig {
  columnSpan?: number;
}
