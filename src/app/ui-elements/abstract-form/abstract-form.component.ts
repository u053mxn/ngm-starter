import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {FieldConfig} from './field.interface';

@Component({
  selector: 'ui-abstract-form',
  templateUrl: './abstract-form.component.html',
  styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent implements AfterViewInit {
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;
  @Input() formTitle = '';
  @Input() formConfig: FieldConfig[];
  @Input() columns;
  @Input() gridColumnGap;
  @Input() gridRowGap;

  @Output() formState: EventEmitter<any> = new EventEmitter();
  @Output() dynamicFormInit = new EventEmitter<DynamicFormComponent>();

  ngAfterViewInit(): void {
    this.dynamicFormInit.emit(this.dynamicForm);
  }

  submit(value: any) {
    console.log(value);
    this.formState.emit(value);
  }

  reset() {
    this.dynamicForm.reset();
  }
}
