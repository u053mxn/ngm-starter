import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UiUtility} from '../ui-utility-functions';
import isStringNumber = UiUtility.isStringNumber;
import * as moment from 'moment-mini';
import {Moment} from 'moment-mini';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';

export interface TimepickerTimeChangeEvent {
    valid: boolean;
    time: Date;
}

@Component({
    selector: 'ui-timepicker',
    templateUrl: './timepicker.component.html',
    styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit, AfterViewInit {
    @Input() optional = false;
    @Output() timeChange = new EventEmitter<TimepickerTimeChangeEvent>();
    @ViewChild('hh') hideHour: ElementRef;
    @ViewChild('hm') hideMinute: ElementRef;
    @ViewChild('th') textHour: ElementRef;
    @ViewChild('tm') textMinute: ElementRef;
    hourFormControl: FormControl;
    minuteFormControl: FormControl;
    time: Date;
    meriden: 'AM' | 'PM' = 'AM';
    hourError = false;
    minuteError = false;
    minuteValidators: ValidatorFn[];
    hourValidators: ValidatorFn[];

    constructor() {
        const commonValidators = [Validators.maxLength(2), Validators.pattern('^[0-9]+$')];
        this.minuteValidators = [Validators.max(59), Validators.min(0), Validators.minLength(2), ...commonValidators];
        this.hourValidators = [Validators.max(12), Validators.min(1), ...commonValidators];
        if (!this.optional) {
            this.minuteValidators.push(Validators.required);
            this.hourValidators.push(Validators.required);
        }
        this.timeChange = new EventEmitter();
        this.hourFormControl = new FormControl();
        this.minuteFormControl = new FormControl();
        this.hourFormControl.setValidators(this.hourValidators);
        this.minuteFormControl.setValidators(this.minuteValidators);
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.inputChange(this.textHour, this.hideHour);
        this.inputChange(this.textMinute, this.hideMinute);
    }

    toggleMeriden() {
        this.meriden = this.meriden === 'AM' ? 'PM' : 'AM';
        this.validateTime();
    }

    onFocus(el) {
        if (!isStringNumber(el.value)) {
            el.value = '';
        }
    }

    onBlur(el) {
        if (el.value === '') {
            el.value = '--';
        }
    }

    inputChange(text, hide) {
        try {
            hide.textContent = text.value;
            text.style.width = hide.offsetWidth + 'px';
        } catch (e) {
            hide.nativeElement.textContent = text.nativeElement.value;
            text.nativeElement.style.width = hide.nativeElement.offsetWidth + 'px';
        } finally {
            this.validateTime();
        }
    }

    validateTime(): void {
        this.minuteError = false;
        this.hourError = false;
        const hour: string = this.textHour.nativeElement.value;
        const hourNumber: number = +hour;
        const minute: string = this.textMinute.nativeElement.value;
        const minuteNumber: number = +minute;
        if (!isStringNumber(hour) || hourNumber < 1 || hourNumber > 12) {
            this.hourError = true;
        }
        if (!isStringNumber(minute) || minuteNumber < 0 || minuteNumber > 59) {
            this.minuteError = true;
        }
        if (minuteNumber === 0 && minute.length !== 2) {
            this.minuteError = true;
        }
        if (minuteNumber < 10 && minute.charAt(0) !== '0') {
            this.minuteError = true;
        }
        let valid = false;
        let momentInstance: Moment;
        if (!this.minuteError && !this.hourError) {
            const time = `${hour}:${minute} ${this.meriden}`;
            momentInstance = moment(time, 'HH:mm A');
            valid = momentInstance.isValid();
        }

        this.timeChange.emit({
            valid: valid,
            time: valid ? momentInstance.toDate() : null
        });
    }
}
