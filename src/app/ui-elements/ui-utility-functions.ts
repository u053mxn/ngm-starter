import {ElementRef} from '@angular/core';
import {Subscription} from 'rxjs';

export namespace UiUtility {
    export function isString(val: any): boolean {
        return typeof val === 'string';
    }

    export function isBoolean(val: any): boolean {
        return typeof val !== 'boolean';
    }

    export function isStringNumber(s: string): boolean {
        if (typeof s !== 'string') {
            return false;
        } // we only process strings!
        return !isNaN(Number(s)) && !isNaN(parseFloat(s));
    }

    export function isObject(val: any): boolean {
        return typeof val === 'object';
    }

    export function isDate(val: any): boolean {
        try {
            return new Date(val).toString() !== 'Invalid Date' && !isStringNumber(val);
        } catch (e) {
            return false;
        }
    }

    export function getDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const monthObject = {
            0: 'Jan',
            1: 'Feb',
            2: 'Mar',
            3: 'Apr',
            4: 'May',
            5: 'Jun',
            6: 'Jul',
            7: 'Aug',
            8: 'Sep',
            9: 'Oct',
            10: 'Nov',
            11: 'Dec'
        };
        return `${day < 10 ? 0 : ''}${day}-${monthObject[month]}-${date.getFullYear()}`;
    }

    export function camelCaseToTitleCase(camelCase) {
        if (camelCase == null || camelCase === '') {
            return camelCase;
        }

        camelCase = camelCase.trim();
        let newText = '';
        for (let i = 0; i < camelCase.length; i++) {
            if (/[A-Z]/.test(camelCase[i])
                && i !== 0
                && /[a-z]/.test(camelCase[i - 1])) {
                newText += ' ';
            }
            if (i === 0 && /[a-z]/.test(camelCase[i])) {
                newText += camelCase[i].toUpperCase();
            } else {
                newText += camelCase[i];
            }
        }

        return newText;
    }

    export function scrollToSmooth(el: ElementRef) {
        el.nativeElement.scrollIntoView({
            behavior: 'smooth'
        });
    }

    export function getRandomInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    export function unsubscribeMultiple(subscriptions: Subscription[]) {
        for (const subscription of subscriptions) {
            if (!!subscription) {
                subscription.unsubscribe();
            }
        }
    }
}
