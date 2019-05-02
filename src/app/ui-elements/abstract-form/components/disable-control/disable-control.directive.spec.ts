import {DisableControlDirective} from './disable-control.directive';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, OnInit} from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../../modules/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  template: `
    <form>
      <mat-form-field [formGroup]="group">
        <mat-select [disableControl]="disabled" [formControlName]="controlName" (click)="click()">
          <mat-option [value]="1">{{1}}</mat-option>
        </mat-select>
      </mat-form-field>
    </form>`
})
class TestDisableControlComponent implements OnInit {
  disabled: boolean;
  clicked = false;
  group: FormGroup;
  controlName = 'select';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.group = this.createControl();
  }

  click() {
    this.clicked = true;
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
      declarations: [DisableControlDirective, TestDisableControlComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
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

  it('should not trigger click event', () => {
    component.disabled = true;
    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.clicked).toBeFalsy();
  });

  it('should trigger click event', () => {
    component.disabled = false;
    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.clicked).toBeTruthy();
  });
});
