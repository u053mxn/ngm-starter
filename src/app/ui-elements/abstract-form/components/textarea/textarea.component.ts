import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';
import {isObservable, Observable, Subscription} from 'rxjs';
import {isNumeric} from 'rxjs/internal-compatibility';
import {UiUtility} from '../../../ui-utility-functions';
import unsubscribeMultiple = UiUtility.unsubscribeMultiple;
import {RealTimeErrorStateMatcher} from '../../../realtime-error-state-matcher';

@Component({
  selector: 'ui-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="field.displayed | async" [ngStyle]="{'width': field.width, 'margin': field.margin}">
      <mat-form-field class="dynamic-form-field"
                      [formGroup]="group"
                      floatLabel="always"
                      [ngStyle]="{'width': field.width}">
                <textarea matInput
                          #textAreaElement
                          [tabindex]="field.tabindex"
                          [formControlName]="field.name"
                          [type]="field.inputType"
                          [maxlength]="field.maxlength.toString()"
                          [disableControl]="disabled"
                          [errorStateMatcher]="matcher"
                          [matTooltip]="field.matToolTip"
                          [matTooltipHideDelay]="100"
                          [name]="field.name"
                          [rows]="field.rows || 3"
                          [value]="field.value||''"></textarea>
        <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
          <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
        </ng-container>
        <mat-label>{{field.label}}</mat-label>
        <mat-hint align="start">{{ field.textAreaMessage || '' }}</mat-hint>
        <mat-hint *ngIf="showCharCounter" align="end">{{ getCharacterCountMessage() || field.maxlength + ' characters left.' }}</mat-hint>
      </mat-form-field>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }

    textarea.mat-input-element {
      border: 1px solid #aaaaaa;
      border-bottom: none;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      padding: 5px;
    }

    ui-textarea > div > mat-form-field > div > div.mat-form-field-flex > div.mat-form-field-infix {
      padding-bottom: 5px;
    }
  `],
  encapsulation: ViewEncapsulation.None
})

export class TextAreaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('textAreaElement') textAreaElement: ElementRef;
  @Input() hasFocus = false;
  field: FormattedFieldConfig;
  group: FormGroup;
  disabled = false;
  disabledSubscription: Subscription;
  value: string;
  valueSubscription: Subscription;
  columnSpanSubscription: Subscription;
  maxlength: number;
  showCharCounter: boolean;

  constructor() {
  }

  matcher = new RealTimeErrorStateMatcher();

  ngOnInit() {
    this.setDisabled();
    this.setValue();
    this.showCharCounter = isNumeric(this.field.maxlength);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setFocus(), 0);
  }

  ngOnDestroy(): void {
    const subscriptions = [this.disabledSubscription, this.valueSubscription, this.columnSpanSubscription];
    unsubscribeMultiple(subscriptions);
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

  getCharacterCountMessage() {
    let numOfCharsLeft = this.maxlength;
    if (this.doesTextAreaElementExist()) {
      const textAreaValueLength = this.textAreaElement.nativeElement.value.length;
      numOfCharsLeft = this.field.maxlength - textAreaValueLength;
    }
    const messageString = numOfCharsLeft + ' character' + (numOfCharsLeft !== 1 ? 's' : '') + ' left.';
    return isNaN(numOfCharsLeft) ? '' : numOfCharsLeft === undefined ? '' : messageString;
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

  doesTextAreaElementExist() {
    return this.textAreaElement
      && this.textAreaElement.nativeElement
      && this.textAreaElement.nativeElement.value;
  }

  setFocus() {
    if (this.field.hasFocus) {
      this.textAreaElement.nativeElement.focus();
      this.textAreaElement.nativeElement.classList.add('cdk-focused', 'cdk-keyboard-focused');
    }
  }
}
