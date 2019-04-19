import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {FieldConfig} from './field.interface';

export class FormData {
  input = '';
  select = '';
}

export enum InputType {
  INPUT,
  SELECT
}

export interface FormElementStructure {
  fieldName: string;
  fieldType: InputType;
  dataType?: string;
  dropDownOptions?: string[];
  placeholder?: string;
  label?: string;
}

@Component({
  selector: 'app-abstract-form',
  templateUrl: './abstract-form.component.html',
  styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() lightTheme = true;
  @Input() formTitle = '';
  @Input() formConfig: FieldConfig[];
  @Input() columns;
  @Input() gridColumnGap;
  @Input() gridRowGap;

  @Output() formState: EventEmitter<any> = new EventEmitter();

  submit(value: any) {
    console.log(value);
    this.formState.emit(value);
  }
}
