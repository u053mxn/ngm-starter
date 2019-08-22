import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {E2Log} from '../../../../core/logging/e2-log.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment-mini';
import {Moment} from 'moment-mini';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {BreakpointObserver} from '@angular/cdk/layout';

export interface DatepickerDateChangeEvent {
    valid: boolean;
    date: Date;
}

@Component({
    selector: 'ui-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
    @Input() optional = false;
    @Input() minDate: Date;
    @Output() dateChange: EventEmitter<DatepickerDateChangeEvent>;
    formControl: FormControl;
    date: Moment;
    dayOfWeek: string;
    day: string;
    year: number;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.dateChange = new EventEmitter();
        this.formControl = new FormControl(
            this.optional ? [''] : ['', Validators.required]
        );
    }

    ngOnInit() {

    }

    get isMobile() {
        return this.breakpointObserver.isMatched('(max-width: 767px)');
    }

    get calendarIcon() {
        return !!this.date ? ['far', 'calendar-check'] : ['fas', 'calendar-day'] as IconProp;
    }

    onDateChange(date) {
        E2Log.info(date);
        this.date = moment(date);
        this.dayOfWeek = this.date.format('ddd');
        this.day = this.date.format('MMMM Do');
        this.year = this.date.year();
        this.dateChange.emit({
            valid: true,
            date: this.date.toDate()
        });
    }
}
