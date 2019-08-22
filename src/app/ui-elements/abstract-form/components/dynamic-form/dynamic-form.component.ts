import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldConfig} from '../../field.interface';
import {BehaviorSubject, fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {E2Log} from '../../../../../../core/logging/e2-log.service';

@Component({
    exportAs: 'dynamicForm',
    selector: 'ui-dynamic-form',
    template: `
        <form #formElement [id]="id" class="dynamic-form" [formGroup]="formGroup" (submit)="onSubmit($event)"
              [ngStyle]="{
          'grid-column-gap': gridColumnGap,
          'grid-row-gap': gridRowGap}"
              [style.gridTemplateColumns]="safeColumnStyles">
            <ui-parent-field *ngFor="let field of formattedFields; let i = index">
                <ng-container uiDynamicField [field]="field" [group]="formGroup"></ng-container>
            </ui-parent-field>
        </form>
    `,
    styles: [`
        .dynamic-form {
            width: 100%;
            display: grid;
            justify-items: start;
            grid-column-gap: 1em;
            display: -ms-grid;
        }

        ui-parent-field {
            display: flex;
        }

        ui-parent-field > * {
            width: 100%;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit, OnDestroy {
    @ViewChild('formElement') formElement: ElementRef;
    @Input() fields: FieldConfig[] = [];
    @Input() verticalAlign = false;
    @Input() columns: number;
    @Input() gridColumnGap = '1em';
    @Input() gridRowGap = '0em';
    @Input() singleColumnMaxWidth = 600;
    @Input() doubleColumnMaxWidth = 1440;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();

    formGroup: FormGroup;
    resizeSub: Subscription;
    formattedFields: FormattedFieldConfig[] = [];
    gridColumns;
    safeColumnStyles;
    id;
    isIe = false;
    msGridSetup: MsGridSetup = {
        rowMap: [[]],
        currentRow: 0
    };

    constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.isIe = /MSIE|Trident/.test(window.navigator.userAgent);
        this.id = Math.random().toString(36).slice(7);
        this.formattedFields = this.fields;
        this.formattedFields.forEach(ff => ff.columnSpanEmitter = new BehaviorSubject<StyleTransferObject>({}));
        this.onInit();
        this.formGroup = this.createControl();
        // throttle resize events
        this.resizeSub = fromEvent(window, 'resize').pipe(
            throttleTime(700)
        ).subscribe(() => {
            this.onInit();
        });
    }

    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
    }

    onInit() {
        this.msGridSetup.currentRow = 0;
        this.msGridSetup.rowMap = [[]];
        this.setGridColumns();
        this.setFieldGridInformation();
        this.setMsGridColumnStyles(this.formattedFields);
        this.setSafeColumnStyles(this.gridColumns);
        this.setIeStyles(this.gridColumns);
        this.emitStyleChanges();
    }

    /**
     * If no passed in column value, set grid columns dynamically based on component width
     */
    setGridColumns() {
        const w = this.formElement.nativeElement.offsetWidth;
        if (!!this.columns) {
            this.gridColumns = this.columns;
        } else {
            if (w < this.singleColumnMaxWidth) {
                this.gridColumns = 1;
            } else if (w >= this.singleColumnMaxWidth && w < this.doubleColumnMaxWidth) {
                this.gridColumns = 2;
            } else {
                this.gridColumns = 4;
            }
        }
    }

    setFieldGridInformation() {
        for (let i = 0; i < this.formattedFields.length; i++) {
            const f = this.formattedFields[i];
            const csf = f.columnSpanFraction;
            const cStartFraction = f.columnStartFraction;
            let csEmit = this.gridColumns;
            let cspanEmit;
            if (!!csf && csf <= 1 && csf > 0) {
                const cs = Math.floor(this.gridColumns * (csf));
                csEmit = cs > 0 ? cs : 1;
            }
            if (!!cStartFraction && cStartFraction <= 1 && cStartFraction > 0) {
                const cs = Math.floor(this.gridColumns * (cStartFraction));
                if (cStartFraction === 1) {
                    cspanEmit = this.gridColumns;
                } else {
                    cspanEmit = cs > 0 ? cs + 1 : 1;
                }
            }
            f.columnSpan = csEmit;
            f.columnStart = cspanEmit;
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.formGroup.valid) {
            this.submit.emit(this.formGroup.value);
        } else {
            this.validateAllFormFields(this.formGroup);
        }
    }

    reset() {
        this.formGroup.reset();
    }

    emitStyleChanges() {
        for (const ff of this.formattedFields) {
            ff.columnSpanEmitter.next({
                hostSpan: ff.columnSpan,
                hostColumnStart: ff.columnStart,
                isIe: this.isIe,
                hostMsColumnSpan: ff.columnSpan,
                hostMsColumnStart: ff.msGridColumnStart,
                hostMsGridRow: ff.msGridRow,
                hostMsGridGap: ff.msGridGap
            });
        }
    }

    setMsGridColumnStyles(formattedFields: FormattedFieldConfig[]) {
        if (this.isIe) {
            for (let f = 0; f < formattedFields.length; f++) {
                const ff = formattedFields[f];
                const fieldIndex = f;
                const rowMap = this.msGridSetup.rowMap;
                let currentRow = this.msGridSetup.currentRow;
                let availableSpace = this.gridColumns - rowMap[currentRow].length;
                if (ff.columnSpan > availableSpace) {
                    currentRow += 1;
                }
                for (let i = 0; i < ff.columnSpan; i++) {
                    if (!rowMap[currentRow]) {
                        rowMap[currentRow] = [];
                    }
                    // IF THERE IS SPACE BEFORE THE START OF THIS FIELD'S COLUMN...  FILL WITH -1's
                    while (i === 0 && ff.columnStart >= rowMap[currentRow].length + 2) {
                        rowMap[currentRow].push(-1);
                    }
                    rowMap[currentRow].push(fieldIndex);
                    availableSpace = this.gridColumns - rowMap[currentRow].length;
                    // IF THIS IS THE LAST ROW OR SPAN OF NEXT ITEM IS GREATER THAN AVAILABLE SPACE...  FILL WITH -1's
                    while ((fieldIndex === this.formattedFields.length - 1 || this.formattedFields[fieldIndex + 1].columnSpan > availableSpace) &&
                    availableSpace > 0 && i === ff.columnSpan - 1) {
                        rowMap[currentRow].push(-1);
                        availableSpace = this.gridColumns - rowMap[currentRow].length;
                    }
                }

                // SET IE GRID GAP
                this.setIeGridGap(rowMap, currentRow);

                ff.msGridRow = currentRow + 1;
                ff.msGridColumnStart = rowMap[currentRow].indexOf(fieldIndex) + 1;
                this.msGridSetup.currentRow = currentRow;
                E2Log.info('ROW MAP', rowMap);
            }
        }
    }

    setIeStyles(columns: number) {
        if (this.isIe) {
            try {
                console.warn('set ie style');
                this.formElement.nativeElement.style.msGridColumns = this.generateGridRepeat(columns);
                E2Log.info(this.formElement.nativeElement.style);
            } catch (e) {
                console.error(e);
            }
        }
    }

    setIeGridGap(rowMap: number[][], currentRow: number) {
        if (rowMap[currentRow].length === this.gridColumns) {
            for (let i = 0; i < rowMap[currentRow].length; i++) {
                const rowGap = [this.gridRowGap, this.gridColumnGap, this.gridRowGap, this.gridColumnGap].map(size => this.halfSizeUnit(size));
                const fi = rowMap[currentRow][i];
                if (i === 0 || rowMap[currentRow][i - 1] === rowMap[currentRow][i]) {
                    rowGap[3] = '0em';
                }
                if (i === rowMap[currentRow].length - 1 || rowMap[currentRow][i + 1] === rowMap[currentRow][i]) {
                    rowGap[1] = '0em';
                }
                if (fi !== -1) {
                    this.formattedFields[fi].msGridGap = `${rowGap[0]} ${rowGap[1]} ${rowGap[2]} ${rowGap[3]}`;
                }
            }
        }
    }

    setSafeColumnStyles(columns: number) {
        this.safeColumnStyles = this.sanitizer.bypassSecurityTrustStyle(`repeat(${columns}, 1fr)`);
    }

    generateGridRepeat(n: number) {
        let s = '';
        for (let i = 0; i < n; i++) {
            s += '1fr ';
        }
        return s;
    }

    splitSizeUnitString(str: string): string[] {
        return str.match(/[a-z]+|[^a-z]+/gi);
    }

    halfSizeUnit(str: string): string {
        const strArr: string[] = this.splitSizeUnitString(str);
        let val;
        try {
            val = (parseFloat(strArr[0]) * 0.5).toString();
            return val + strArr[1];
        } catch (e) {
            return str;
        }
    }

    createControl() {
        const group = this.fb.group({}, {updateOn: 'change'});
        this.formattedFields.forEach(field => {
            if (field.type === 'button') {
                return;
            }
            const control = this.fb.control(
                field.value || '',
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
    columnSpanEmitter?: BehaviorSubject<StyleTransferObject>;
    columnSpan?: number;
    columnStart?: number;
    msGridColumnStart?: number;
    msGridRow?: number;
    msGridGap?: string;
}


export interface StyleTransferObject {
    hostSpan?: number;
    hostColumnStart?: number;
    isIe?: boolean;
    hostMsColumnSpan?: number;
    hostMsColumnStart?: number;
    hostMsGridRow?: number;
    hostMsGridGap?: string;
}

interface MsGridSetup {
    rowMap: number[][];
    currentRow: number;
}
