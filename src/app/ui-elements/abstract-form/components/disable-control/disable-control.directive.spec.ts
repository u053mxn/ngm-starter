import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiElementsModule } from '../../../ui-elements.module';
import { DisableControlDirective } from './disable-control.directive';

@Component({
    template: `
        <form>
            <mat-form-field [formGroup]="group">
                <mat-select [disableControl]="disabled" [formControlName]="controlName">
                    <mat-option>1</mat-option>
                    <mat-option>2</mat-option>
                    <mat-option>3</mat-option>
                </mat-select>
            </mat-form-field>
        </form>`
})
class TestDisableControlComponent implements OnInit {
    @ViewChild(MatSelect) matSelect: MatSelect;
    disabled: boolean;
    clicked = false;
    group: FormGroup;
    controlName = 'select';

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.group = this.createControl();
    }

    createControl() {
        const group = this.fb.group({});
        const control = this.fb.control(
            1
        );
        group.addControl(this.controlName, control);
        return group;
    }
}

describe('DisableControl.Directive.TsDirective', () => {
    let component: TestDisableControlComponent;
    let fixture: ComponentFixture<TestDisableControlComponent>;
    let buttonEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestDisableControlComponent],
            imports: [
                UiElementsModule, BrowserAnimationsModule
            ]
        });

        fixture = TestBed.createComponent(TestDisableControlComponent);
        component = fixture.componentInstance;
        buttonEl = fixture.debugElement.query(By.directive(DisableControlDirective));
        fixture.detectChanges();
    });

    it('test component should exist', () => {
        expect(component).toBeDefined();
    });
});
