import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {FieldConfig} from './field.interface';
import {Observable} from 'rxjs';

@Component({
    selector: 'ui-abstract-form',
    template: `
        <ui-panel-card class="form-container" *ngIf="formConfig">
            <div style="text-align:center">
                <ui-section-text *ngIf="formTitle">
                    {{formTitle}}
                </ui-section-text>
            </div>
            <ui-dynamic-form *ngIf="showForm" [fields]="formConfig" [columns]="columns" [gridRowGap]="gridRowGap" [gridColumnGap]="gridColumnGap"
                             [singleColumnMaxWidth]="singleColumnMaxWidth" [doubleColumnMaxWidth]="doubleColumnMaxWidth"
                             (submit)="submit($event)"></ui-dynamic-form>
        </ui-panel-card>`,
    styles: [`
        .form-container {
            margin: 0 auto;
        }
    `]
})
export class AbstractFormComponent<T = object> implements AfterViewInit {
    @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;
    @Input() formTitle = '';
    @Input() formConfig: FieldConfig[];
    @Input() columns: number;
    @Input() gridColumnGap = '1em';
    @Input() gridRowGap = '0em';
    @Input() singleColumnMaxWidth = 600;
    @Input() doubleColumnMaxWidth = 1440;
    @Output() formState: EventEmitter<any> = new EventEmitter();
    @Output() dynamicFormInit = new EventEmitter<DynamicFormComponent>();

    showForm = true;

    constructor() {
    }

    ngAfterViewInit(): void {
        this.dynamicFormInit.emit(this.dynamicForm);
    }

    get valueChanges(): Observable<any> {
        return this.dynamicForm.formGroup.valueChanges;
    }

    get formValues(): T {
        const formValues = {};
        Object.keys(this.dynamicForm.formGroup.controls).forEach(key => formValues[key] = this.dynamicForm.formGroup.controls[key].value);
        const returnObject = {} as T;
        this.formConfig.forEach(field => returnObject[field.returnName || field.name] =
            formValues[field.name] ? ((formValues[field.name].value === 0 || !!formValues[field.name].value)
                ? formValues[field.name].value : formValues[field.name].value === null ? null : formValues[field.name]) : null);
        return returnObject;
    }

    submit(value: any) {
        this.formState.emit(value);
    }

    markFormAsPristineIfAllFalsyValues(change: any) {
        if (Object.entries(change).every(entry => !!entry && (entry.length === 2 && !entry[1]))) {
            this.dynamicForm.formGroup.markAsPristine();
        }
    }

    //
    // markFormAsPristineIfAllFalsyValues(object: any) {
    //     let allFalsy = true;
    //     for (const key in object) {
    //         if (object.hasOwnProperty(key) && !object[key]) {
    //             allFalsy = false;
    //         }
    //     }
    //     return allFalsy;
    // }

    // convertEmptyStringToNull(change: any) {
    //     Object.entries(change).forEach(entry => {
    //         if (entry[1] === '') {
    //             change[entry[0]] = null;
    //         }
    //     });
    // }

    convertEmptyStringToNull(object: any) {
        for (const key in object) {
            if (object.hasOwnProperty(key) && !!object[key]) {
                if (object[key] === '') {
                    object[key] = null;
                }
            }
        }
    }
}
