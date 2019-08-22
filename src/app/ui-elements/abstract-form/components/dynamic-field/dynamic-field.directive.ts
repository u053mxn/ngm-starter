import {ComponentFactoryResolver, Directive, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InputComponent} from '../input/input.component';
import {ButtonComponent} from '../button/button.component';
import {SelectComponent} from '../select/select.component';
import {DateComponent} from '../date/date.component';
import {RadiobuttonComponent} from '../radiobutton/radiobutton.component';
import {CheckboxComponent} from '../checkbox/checkbox.component';
import {FormattedFieldConfig} from '../dynamic-form/dynamic-form.component';
import {TextAreaComponent} from '../textarea/textarea.component';
import {of} from 'rxjs';

const componentMapper = {
    input: InputComponent,
    button: ButtonComponent,
    select: SelectComponent,
    date: DateComponent,
    radiobutton: RadiobuttonComponent,
    checkbox: CheckboxComponent,
    textarea: TextAreaComponent
};

@Directive({
    selector: '[uiDynamicField]'
})
export class DynamicFieldDirective implements OnInit {
    @Input() field: FormattedFieldConfig;
    @Input() group: FormGroup;
    @HostListener('style.width') width;
    componentRef: any;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) {
    }

    ngOnInit() {
        const factory = this.resolver.resolveComponentFactory(
            componentMapper[this.field.type]
        );
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        this.field.width = this.field.width || '100%';
        this.field.rowspan = this.field.rowspan || 1;
        this.field.displayed = this.field.displayed === undefined ? of(true) : this.field.displayed;
    }
}
