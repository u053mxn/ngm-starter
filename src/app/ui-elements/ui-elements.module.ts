import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AppMaterialModule} from '../../../app-material/app-material.module';
import {AbstractFormComponent} from './abstract-form/abstract-form.component';
import {ButtonComponent} from './abstract-form/components/button/button.component';
import {CheckboxComponent} from './abstract-form/components/checkbox/checkbox.component';
import {DateComponent} from './abstract-form/components/date/date.component';
import {DisableControlDirective} from './abstract-form/components/disable-control/disable-control.directive';
import {DynamicFieldDirective} from './abstract-form/components/dynamic-field/dynamic-field.directive';
import {DynamicFormComponent} from './abstract-form/components/dynamic-form/dynamic-form.component';
import {InputComponent} from './abstract-form/components/input/input.component';
import {RadiobuttonComponent} from './abstract-form/components/radiobutton/radiobutton.component';
import {SelectComponent} from './abstract-form/components/select/select.component';
import {TextAreaComponent} from './abstract-form/components/textarea/textarea.component';
import {DataTableComponent} from './data-table/data-table.component';
import {FaIconCircleComponent} from './fa-icon-circle/fa-icon-circle.component';
import {LoadingWrapperComponent} from './loading-wrapper/loading-wrapper.component';
import {PanelCardComponent} from './panel-card/panel-card.component';
import {SectionTextComponent} from './section-text/section-text.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {TitleTextComponent} from './title-text/title-text.component';
import {ParentFieldComponent} from './abstract-form/components/parent-field/parent-field.component';
import {ContentCardComponent} from './content-card/content-card.component';
import {SectionHeaderComponent} from './section-header/section-header.component';
import {RouterModule} from '@angular/router';
import {DottedVerticalSeparatorComponent} from './dotted-vertical-separator/dotted-vertical-separator.component';
import {BackButtonComponent} from './back-button/back-button.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {TimepickerComponent} from './timepicker/timepicker.component';
import { OnOffLightComponent } from './on-off-light/on-off-light.component';
import {LayoutModule} from '@angular/cdk/layout';

@NgModule({
    declarations: [
        PanelCardComponent,
        AbstractFormComponent,
        ButtonComponent,
        CheckboxComponent,
        DateComponent,
        DynamicFieldDirective,
        DynamicFormComponent,
        InputComponent,
        RadiobuttonComponent,
        SelectComponent,
        LoadingWrapperComponent,
        SectionTextComponent,
        SpinnerComponent,
        TitleTextComponent,
        DataTableComponent,
        DisableControlDirective,
        TextAreaComponent,
        FaIconCircleComponent,
        ParentFieldComponent,
        ContentCardComponent,
        SectionHeaderComponent,
        DottedVerticalSeparatorComponent,
        BackButtonComponent,
        DatepickerComponent,
        TimepickerComponent,
        OnOffLightComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        LayoutModule,
        RouterModule,
    ],
    exports: [
        FlexLayoutModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        PanelCardComponent,
        AbstractFormComponent,
        ButtonComponent,
        CheckboxComponent,
        DateComponent,
        DynamicFieldDirective,
        DynamicFormComponent,
        InputComponent,
        RadiobuttonComponent,
        SelectComponent,
        LoadingWrapperComponent,
        SectionTextComponent,
        SpinnerComponent,
        TitleTextComponent,
        DataTableComponent,
        FontAwesomeModule,
        DisableControlDirective,
        TextAreaComponent,
        FaIconCircleComponent,
        ParentFieldComponent,
        ContentCardComponent,
        SectionHeaderComponent,
        DottedVerticalSeparatorComponent,
        BackButtonComponent,
        DatepickerComponent,
        TimepickerComponent,
        OnOffLightComponent
    ],
    entryComponents: [
        AbstractFormComponent,
        DynamicFormComponent,
        InputComponent,
        ButtonComponent,
        SelectComponent,
        DateComponent,
        RadiobuttonComponent,
        CheckboxComponent,
        TextAreaComponent,
        ParentFieldComponent
    ]
})
export class UiElementsModule {
}
