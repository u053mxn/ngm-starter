import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Validator {
  name: string;
  validator: any;
  message: string;
}

export type FormField = 'button' | 'checkbox' | 'date' | 'input' | 'radiobutton' | 'select';

export type Alignment = 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly';

export interface SelectOptions {
  id?: number | string;
  label?: number | string | null | undefined;
}

export interface SelectionChangeResponse {
  options$: Observable<SelectOptions[]>;
  targetField: string;
}

export interface SelectionChange {
  options: SelectOptions[];
  targetField: string;
}

export interface DisableInSequence {
  parentFieldName: string;
}

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: SelectOptions[] | Observable<SelectOptions[]>;
  selectionChange?: (fieldName: string) => SelectionChangeResponse;
  selectionEvent?: EventEmitter<SelectionChange>;
  selectionOptions?: (queryParam: string, http?: HttpClient) => Observable<SelectOptions[]>;
  parentFieldName?: string;
  collections?: any;
  type: FormField;
  value?: any;
  validations?: Validator[];
  disabled$?: Observable<boolean>;
  loading$?: Observable<boolean>;
  width?: string;
  rowWidth?: string;
  columnSpanFraction?: number;
  alignment?: Alignment;
  disableInSequence?: DisableInSequence;
  returnName?: string;
}


