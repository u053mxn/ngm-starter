import {NgModule} from '@angular/core';
import {AbstractFormComponent} from './abstract-form/abstract-form.component';
import {ButtonComponent} from './abstract-form/components/button/button.component';
import {CheckboxComponent} from './abstract-form/components/checkbox/checkbox.component';
import {DateComponent} from './abstract-form/components/date/date.component';
import {DynamicFieldDirective} from './abstract-form/components/dynamic-field/dynamic-field.directive';
import {DynamicFormComponent} from './abstract-form/components/dynamic-form/dynamic-form.component';
import {InputComponent} from './abstract-form/components/input/input.component';
import {RadiobuttonComponent} from './abstract-form/components/radiobutton/radiobutton.component';
import {SelectComponent} from './abstract-form/components/select/select.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActionButtonContainerComponent} from './action-button-container/action-button-container.component';
import {InfoMessageComponent} from './info-message/info-message.component';
import {LoadingWrapperComponent} from './loading-wrapper/loading-wrapper.component';
import {PanelCardComponent} from './panel-card/panel-card.component';
import {SectionTextComponent} from './section-text/section-text.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {TitleTextComponent} from './title-text/title-text.component';
import {DataTableComponent} from './data-table/data-table.component';
import {LevelTwoPageContainerComponent} from '../e2-elements/level-two-page-container/level-two-page-container.component';
import {LevelTwoSidebarComponent} from '../e2-elements/level-two-sidebar/level-two-sidebar.component';
import {MaterialModule} from '../../modules/material.module';
import {AppRoutingModule} from '../../modules/app.routing.module';
import {LoginAnimationComponent} from '../e2-elements/login-animation/login-animation.component';
import {DisableControlDirective} from './abstract-form/components/disable-control/disable-control.directive';

@NgModule({
  declarations: [
    AbstractFormComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    InputComponent,
    RadiobuttonComponent,
    SelectComponent,
    ActionButtonContainerComponent,
    InfoMessageComponent,
    LoadingWrapperComponent,
    PanelCardComponent,
    SectionTextComponent,
    SpinnerComponent,
    TitleTextComponent,
    DataTableComponent,
    DisableControlDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AbstractFormComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    InputComponent,
    RadiobuttonComponent,
    SelectComponent,
    ActionButtonContainerComponent,
    InfoMessageComponent,
    LoadingWrapperComponent,
    PanelCardComponent,
    SectionTextComponent,
    SpinnerComponent,
    TitleTextComponent,
    DataTableComponent,
    DisableControlDirective
  ],
  entryComponents: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent
  ]
})
export class UiElementsModule {
}
