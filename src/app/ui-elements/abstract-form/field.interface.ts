import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {Validators} from '@angular/forms';
import {HierarchyService} from '../../../../services/hierarchy/hierarchy.service';
import {SelectComponent} from './components/select/select.component';

export interface Validator {
    name: string;
    validator: any;
    message: string;
}

export type FormField = 'button' | 'checkbox' | 'date' | 'input' | 'radiobutton' | 'select' | 'textarea';

export type Alignment = 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly';

export interface SelectOptions<T = number | string> {
    value?: T;
    label?: number | string | null | undefined;
}

export interface SelectOptionsGroup {
    name: string;
    options: SelectOptions[];
}

export interface SelectionChangeResponse {
    options$: Observable<SelectOptions[]>;
    targetField: string;
}

export interface SelectionChange {
    options: SelectOptions[];
    targetField: string;
    selection: SelectOptions;
}

export interface DisableInSequence {
    parentFieldName: string;
}

interface SelectConfig {
    includeAllSelectOption?: boolean; // If true will add 'All' to the top of the list of select dropdowns
    defaultToAllSelectOption?: boolean; // If true will set 'All' as the value of the dropwdown after options are loaded
    disableInSequence?: DisableInSequence; // Used to enable fields based on the status of their parent. Needs the parent field name
    disableFieldsWhenLoadingOptions?: boolean; // If true, will disable all fields while options array is being loaded
    options?: SelectOptions[] | Observable<SelectOptions[]>; // An array of select options objects that is what will be in the select dropdown
    selectionChange?: (fieldName: string) => SelectionChangeResponse; // The function that is run when the field is selected
    selectionEvent?: EventEmitter<SelectionChange>; // An event emiiter that is used to send notice of a selection event back to other fields in the group
    // A reference to a function that will be used to load options for another field based on what was selected in the current dropdown
    selectionOptions?: (queryParam: string, hierarchyService?: HierarchyService) => Observable<SelectOptions[]>;
}

interface InputConfig {
    inputType?: string; // Sets input field type eg: text, email, number, etc...
    validations?: Validator[]; // An array of validators to run against an input field
}

interface TextareaConfig {
    maxlength?: number; // Sets max number of characters allowed in a textarea
    textAreaMessage?: string; // Sets textarea message
    rows?: number; // Sets number of rows in textarea
}

interface UiConfig {
    width?: string; // Width of the field inside it's grid container eg: '100%', '20px', etc...
    rowWidth?: string; // Width of the grid container eg: '100%', '20px', etc...
    /*The fraction that the field should take up based on the number of grid columns. If set to 0.5 and there are 2 columns, this will span half the width of the form.
    If set to 1 and there are 2 columns, this will span the entire width*/
    columnSpanFraction?: number;
    columnStartFraction?: number; // If set to 0.5 and there are 2 columns, will start grid at column 1
    rowspan?: number; // Number of rows to span in a grid
    alignment?: Alignment; // Sets the flex alignment of the field
}

export interface FieldConfig extends SelectConfig, InputConfig, TextareaConfig, UiConfig {
    type: FormField; // Determines what type of field will be rendered
    name?: string; // Name of the form set in the form group
    parentFieldName?: string; // If fields are in sequential order, this is used to identify the parent field. This would be the 'name' field of the parent field
    returnName?: string; // The default field name in the returned object of the form contents uses the 'name' property. This overrides only that
    title?: string; // Title hover text
    matToolTip?: string; // Mat Tooltip hover text
    label?: string; // Used to display text next to the field
    value?: any | SelectOptions; // The value of a field. eg: the initial value of an input field or the selection of a select field
    disabled?: boolean | Observable<boolean>; // If the field is disabled or not. Can take a boolean or observable if more complicated behavior is needed
    loading$?: Observable<boolean>; // If a button is used in the field, used to display a loading icon when this resolves to true
    displayed?: Observable<boolean>; // Shows or hides a field
    valueChange?: (value: SelectOptions, selectComponent: SelectComponent) => void; // A function to run when a value changes
    collections?: any; // Not sure what this is doing... +_+
    readOnly?: boolean | Observable<boolean>;
    tabindex?: number;
    hasFocus?: boolean;
    margin?: string;
}

export namespace FieldConstants {
    export const ALL_OPTION: SelectOptions = {value: 'ALL', label: 'All'};
}

export namespace FieldValidators {
    export const REQUIRED_VALIDATOR = (fieldLabel: string): Validator => {
        return {
            name: 'required',
            validator: Validators.required,
            message: `${fieldLabel} Required`
        };
    };

    export const TEXT_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[a-zA-Z]+$'),
            message: 'Accept only text'
        };
    };

    export const TEXT_NUMBER_DASH_PAREN_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[a-zA-Z0-9\\-()]+$'),
            message: 'Accept only text, numbers, parenthesis, and dashes'
        };
    };

    export const NO_NUMBER_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[a-zA-Z\\s\\-]+$'),
            message: 'Accept only text, dashes or spaces'
        };
    };

    export const NUMBER_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[0-9]+$'),
            message: 'Accept only numbers'
        };
    };

    export const CURRENCY_VALUE_VALIDATOR = (message?: string): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('\^([\\d]*)(\\.|$)([\\d]{0,2}|)$'),
            message: message || 'Currency field limited to numeric characters.'
        };
    };

    export const CURRENCY_GREATER_THAN_MIN_VALUE = (minValue: number, message: string): Validator => {
        return {
            name: 'min',
            validator: Validators.min(minValue),
            message: message
        };
    };

    export const CURRENCY_LESS_THAN_MAX_VALUE = (maxValue: number, message: string): Validator => {
        return {
            name: 'max',
            validator: Validators.max(maxValue),
            message: message
        };
    };

    export const NUMBER_DASH_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[0-9\\-]+$'),
            message: 'Accept only numbers and dashes'
        };
    };

    export const REMARKS_TEXTAREA_VALIDATOR = (): Validator => {
        return {
            name: 'pattern',
            validator: Validators.pattern('^[a-zA-Z0-9$()\\/:?@,.\'_\\-\\s]+$'),
            message: 'Invalid Character. Allowed characters are Aa-Zz 0-9 $ ( ) / : ? @ , . ‘ _ -'
        };
    };

}

