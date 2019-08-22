import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';
import {isObservable, Observable, Subscription} from 'rxjs';
import {FieldConstants, SelectionChange, SelectionChangeResponse, SelectOptions} from '../../field.interface';
import {MatSelect} from '@angular/material';
import {map} from 'rxjs/operators';
import ALL_OPTION = FieldConstants.ALL_OPTION;
import {UiUtility} from '../../../ui-utility-functions';
import unsubscribeMultiple = UiUtility.unsubscribeMultiple;

@Component({
    selector: 'ui-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <mat-form-field class="dynamic-form-field" [formGroup]="group" [ngStyle]="{'width': field.width}">
            <mat-select [placeholder]="field.label" [formControlName]="field.name"
                        [matTooltip]="field.matToolTip" [matTooltipHideDelay]="100"
                        [aria-label]="field.matToolTip"
                        (selectionChange)="selection(field.selectionChange ? field.selectionChange($event.value.value) : null, $event.value)"
                        [disableControl]="disableControl()"
                        [compareWith]="compareFn"
                        [id]="fieldId">
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
export class SelectComponent implements OnInit, OnDestroy {
    @ViewChild(MatSelect) matSelect: MatSelect;
    @Output() selected = new EventEmitter<SelectionChange>();

    field: FormattedFieldConfig;
    group: FormGroup;

    options: SelectOptions[];
    disabled: boolean;

    optionsSubscription: Subscription;
    valueChangeSubscription: Subscription;
    optionsChangeSubscription: Subscription;
    columnSpanSubscription: Subscription;
    disabledSubscription: Subscription;

    fieldId: string;
    disabledFieldTracker: string[] = [];

    constructor(private cdRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.fieldId = `form_id_${this.field.name}`;
        this.storeDisabledFieldsIndex();
        this.setOptions();
        this.setValueChanges();
        this.setDisabled();
    }

    ngOnDestroy(): void {
        const subscriptions = [this.optionsSubscription, this.optionsChangeSubscription, this.valueChangeSubscription, this.columnSpanSubscription, this.disabledSubscription];
        unsubscribeMultiple(subscriptions);
    }

    setValueChanges() {
        this.valueChangeSubscription = this.matSelect.valueChange.subscribe((change) => {
            this.field.valueChange(change, this);
        });
    }

    setOptions() {
        if (!this.isObservable(this.field.options)) {
            this.options = this.addAllOption(this.field.options as SelectOptions[]);
            this.afterOptionsLoaded(this.options);
        } else {
            this.optionsSubscription = (this.field.options as Observable<SelectOptions[]>).pipe(
                map(options => {
                    return this.addAllOption(options);
                })
            ).subscribe(options => {
                this.options = options;
                this.afterOptionsLoaded(options);
            });
        }
    }

    setDisabled() {
        if (!this.isObservable(this.field.disabled)) {
            this.disabled = this.field.disabled as boolean;
        } else {
            this.disabledSubscription = (this.field.disabled as Observable<boolean>).subscribe(disabled => {
                this.disabled = disabled;
            });
        }
    }

    afterOptionsLoaded(options: SelectOptions[]) {
        this.setAllOption(options);
        this.setValue(options);
        this.enableFormFieldsAboveCurrentIfOptionsExist(options);
        this.cdRef.detectChanges();
    }

    setValue(options: SelectOptions[]) {
        if (!!this.field.value && !!options) {
            const toSelect = options.find(c => c.value === this.field.value.value);
            this.group.get(this.field.name).setValue(toSelect);
        }
    }

    addAllOption(options: SelectOptions[]) {
        if (this.field.includeAllSelectOption) {
            if (!!options && options.length > 0 && !options.find(option => option.value === ALL_OPTION.value)) {
                options.unshift(ALL_OPTION);
            }
        }
        return options;
    }

    setAllOption(options: SelectOptions[]) {
        if (this.field.defaultToAllSelectOption) {
            if (!!options && options.length > 0 && options.find(option => option.value === ALL_OPTION.value)) {
                this.field.value = ALL_OPTION;
            }
        }
    }

    disableControl(): boolean {
        const isParentField = (!!this.field.disableInSequence && !!this.field.disableInSequence.parentFieldName);
        return this.disabled ||
            (isParentField && (!(this.group.controls[this.field.disableInSequence.parentFieldName].value) || !this.options || this.options.length === 0));

    }

    isObservable(val: any): boolean {
        return isObservable(val);
    }

    selection(changeResponse: SelectionChangeResponse, selection: SelectOptions) {
        if (!!changeResponse) {
            this.disableAllFormFields();
            this.cdRef.detectChanges();
            this.optionsChangeSubscription = changeResponse.options$.subscribe((options: SelectOptions[]) => {
                this.field.selectionEvent.emit({options: options, targetField: changeResponse.targetField, selection: selection});
                this.enableFormFieldsAboveCurrentAfterSelectionChange(changeResponse.targetField);
                this.cdRef.detectChanges();
            });
        }
    }

    storeDisabledFieldsIndex() {
        if (this.field.disabled) {
            this.group.controls[this.field.name]['_fieldDisable'] = true;
        }
        const disabledFields: string[] = [];
        this.formControlLoop((controlName, control) => {
            if (control['_fieldDisable']) {
                disabledFields.push(controlName);
            }
        });
        this.disabledFieldTracker = disabledFields;
    }

    disableAllFormFields() {
        if (this.field.disableFieldsWhenLoadingOptions) {
            this.formControlLoop((controlName, control) => {
                control['disable']();
            });
        }
    }

    enableFormFieldsAboveCurrentIfOptionsExist(options: SelectOptions[]) {
        if (this.field.disableFieldsWhenLoadingOptions) {
            if (!!options && options.length > 0) {
                const fieldIndex = Object.keys(this.group.controls).indexOf(this.field.name);
                this.formControlLoop(this.enableControlIfControlIndexLessThanSelectedIndex, fieldIndex);
            }
        }
    }

    enableFormFieldsAboveCurrentAfterSelectionChange(selectedFieldName: string) {
        if (this.field.disableFieldsWhenLoadingOptions) {
            const selectedIndex = Object.keys(this.group.controls).indexOf(selectedFieldName);
            this.formControlLoop(this.enableControlIfControlIndexLessThanSelectedIndex, selectedIndex);
        }
    }


    enableControlIfControlIndexLessThanSelectedIndex(controlName: string, control: AbstractControl, selectionIndex: number, selectComponent: SelectComponent) {
        const controlIndex = Object.keys(selectComponent.group.controls).indexOf(controlName);
        if (controlIndex <= selectionIndex && !selectComponent.disabledFieldTracker.includes(controlName)) {
            control['enable']();
        }
    }

    formControlLoop(controlFn: (controlName: string, control: AbstractControl, comparisonIndex: number, selectComponent: SelectComponent) => void, comparisonIndex?: number) {
        for (const controlName in this.group.controls) {
            if (!!this.group.controls[controlName]) {
                const control = this.group.controls[controlName];
                controlFn(controlName, control, comparisonIndex, this);
            }
        }
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.value === c2.value : c1 === c2;
    }
}
