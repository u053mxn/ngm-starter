import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';
import {isObservable, Observable, Subscription} from 'rxjs';
import {UiUtility} from '../../../ui-utility-functions';
import unsubscribeMultiple = UiUtility.unsubscribeMultiple;
import {RealTimeErrorStateMatcher} from '../../../realtime-error-state-matcher';

@Component({
  selector: 'ui-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="{'width': field.width}" *ngIf="field.displayed | async">
      <mat-form-field *ngIf="!field.readOnly"
                      class="dynamic-form-field"
                      [formGroup]="group"
                      [ngStyle]="{'width': field.width}">
        <input matInput [formControlName]="field.name"
               #inputField
               [tabindex]="field.tabindex"
               [type]="field.inputType"
               [disableControl]="disabled"
               [matTooltip]="field.matToolTip"
               [matTooltipHideDelay]="100"
               [name]="field.name"
               [errorStateMatcher]="matcher"
               [value]="value||''">
        <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
          <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
        </ng-container>
        <mat-label>{{field.label}}</mat-label>
      </mat-form-field>
      <mat-form-field *ngIf="field.readOnly"
                      class="dynamic-form-field"
                      [class.readonly]="field.readOnly"
                      [formGroup]="group"
                      [ngStyle]="{'width': field.width}">
        <input matInput [formControlName]="field.name"
               #inputField
               readonly
               tabindex="-1"
               [type]="field.inputType"
               [matTooltip]="field.matToolTip"
               [matTooltipHideDelay]="100"
               [name]="field.name"
               [value]="value||''">
        <mat-label>{{field.label}}</mat-label>
      </mat-form-field>
    </div>
  `,
  styles: [`
    mat-form-field.readonly div.mat-form-field-underline {
      display: none;
    }

    :host {
      display: flex;
      align-items: center;
      width: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class InputComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('inputField') inputField: ElementRef;
  field: FormattedFieldConfig;
  group: FormGroup;
  disabled = false;
  disabledSubscription: Subscription;
  columnSpanSubscription: Subscription;
  value = '';
  valueSubscription: Subscription;

  constructor() {
  }

  matcher = new RealTimeErrorStateMatcher();

  ngOnInit() {
    this.setDisabled();
    this.setValue();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setFocus(), 0);
  }

  ngOnDestroy(): void {
    const subs = [this.disabledSubscription, this.valueSubscription, this.columnSpanSubscription];
    unsubscribeMultiple(subs);
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

  isObservable(val: any): boolean {
    return isObservable(val);
  }

  setValue() {
    if (!this.isObservable(this.field.value)) {
      this.value = this.field.value as any;
    } else {
      this.valueSubscription = (this.field.value as Observable<any>).subscribe(newValue => {
        this.value = newValue;
      });
    }
  }

  setFocus() {
    if (this.field.hasFocus) {
      this.inputField.nativeElement.focus();
      this.inputField.nativeElement.classList.add('cdk-focused', 'cdk-keyboard-focused');
      setTimeout(() => this.inputField.nativeElement.select(), 1);
    }
  }
}
