import {Observable} from 'rxjs';

export interface Validator {
  name: string;
  validator: any;
  message: string;
}

export type FormField = 'button' | 'checkbox' | 'date' | 'input' | 'radiobutton' | 'select';

export type Alignment = 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly';

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: string[];
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
}

