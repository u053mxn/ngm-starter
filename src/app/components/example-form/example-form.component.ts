import { Component, OnInit } from '@angular/core';
import {FieldConfig} from '../../ui-elements/abstract-form/field.interface';
import {FORM_COFNIG} from './exampleFormConfig';

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})
export class ExampleFormComponent implements OnInit {
  formConfig: FieldConfig[] = FORM_COFNIG;
  constructor() { }

  ngOnInit() {
  }

  onSubmit(event) {
    console.log('Form Submit');
  }
}
