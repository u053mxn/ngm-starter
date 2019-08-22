import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DynamicFormComponent, FormattedFieldConfig} from './dynamic-form.component';
import {UiElementsModule} from '../../../ui-elements.module';
import {configureTestSuite} from 'ng-bullet';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const fieldConfig: FormattedFieldConfig[] = [
    {
        type: 'input',
        label: 'Username',
        columnSpanFraction: 1,
        inputType: 'text',
        name: 'username'
    },
    {
        type: 'input',
        label: 'Password',
        columnSpanFraction: 1,
        inputType: 'text',
        name: 'password'
    }
];

describe('DynamicFormComponent', () => {
    let component: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;

    configureTestSuite((() => {
        TestBed.configureTestingModule({
            imports: [
                UiElementsModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormComponent);
        component = fixture.componentInstance;
        component.fields = fieldConfig;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should unsubscribe from resize subscription on destroy', () => {
        spyOn(component.resizeSub, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.resizeSub.unsubscribe).toHaveBeenCalled();
    });

    it('should set component id', () => {
        expect(component.id).toBeTruthy();
    });

    it('should set column span emitters', () => {
        component.formattedFields.forEach(f => {
            expect(f.columnSpanEmitter).toBeTruthy();
        });
    });

    it('should create form group from field config', () => {
        expect(component.formGroup).toBeTruthy();
        fieldConfig.forEach(f => {
            expect(component.formGroup.controls[f.name]).toBeTruthy();
        });
    });

    it('should set number of grid columns based off form width', () => {
        const w = component.formElement.nativeElement.offsetWidth;
        if (w < component.singleColumnMaxWidth) {
            expect(component.gridColumns).toBe(1);
        } else if (w >= component.singleColumnMaxWidth && w < component.doubleColumnMaxWidth) {
            expect(component.gridColumns).toBe(2);
        } else {
            expect(component.gridColumns).toBe(4);
        }
    });

    it('should set field column spans when grid columns = 1', () => {
        spyOn(component, 'setGridColumns');
        const testData = [[0, 1], [0.1, 1], [0.5, 1], [1, 1], [1.5, 1], [2, 1]];
        testData.forEach(data => {
            component.fields = [
                {
                    type: 'input',
                    columnSpanFraction: data[0],
                    name: 'username'
                }
            ];
            component.gridColumns = 1;
            component.ngOnInit();
            expect(component.formattedFields[0].columnSpan).toBe(data[1]);
        });
    });

    it('should set field column spans when grid columns = 2', () => {
        spyOn(component, 'setGridColumns');
        const testData = [[0, 2], [0.1, 1], [0.5, 1], [1, 2], [1.5, 2], [2, 2]];
        testData.forEach(data => {
            component.fields = [
                {
                    type: 'input',
                    columnSpanFraction: data[0],
                    name: 'username'
                }
            ];
            component.gridColumns = 2;
            component.ngOnInit();
            console.log(data);
            expect(component.formattedFields[0].columnSpan).toBe(data[1]);
        });
    });

    it('should set field column spans when grid columns = 4', () => {
        spyOn(component, 'setGridColumns');
        const testData = [[0, 4], [0.1, 1], [0.25, 1], [0.45, 1], [0.5, 2], [0.6, 2], [0.75, 3], [0.9, 3], [1, 4], [1.5, 4], [100, 4]];
        testData.forEach(data => {
            component.fields = [
                {
                    type: 'input',
                    columnSpanFraction: data[0],
                    name: 'username'
                }
            ];
            component.gridColumns = 4;
            component.ngOnInit();
            console.log(data);
            expect(component.formattedFields[0].columnSpan).toBe(data[1]);
        });
    });
});
