import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {FieldConfig} from './field.interface';

@Component({
  selector: 'app-abstract-form',
  templateUrl: './abstract-form.component.html',
  styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
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
