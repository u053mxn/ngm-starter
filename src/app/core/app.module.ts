import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import 'hammerjs';

import {AppRoutingModule} from '../routing/app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../material/material.module';
import {MessageService} from '../services/message.service';
import {RestModule} from '../modules/rest';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {AkitaNgRouterStoreModule} from '@datorama/akita-ng-router-store';
import {environment} from '../../environments/environment.prod';
import {HomeComponent} from '../components/home/home.component';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {SnackbarService} from '../material/snackbar';
import {ExampleFormComponent} from '../components/example-form/example-form.component';
import {ActionButtonContainerComponent} from '../ui-elements/action-button-container/action-button-container.component';
import {InfoMessageComponent} from '../ui-elements/info-message/info-message.component';
import {LoadingWrapperComponent} from '../ui-elements/loading-wrapper/loading-wrapper.component';
import {PanelCardComponent} from '../ui-elements/panel-card/panel-card.component';
import {SectionTextComponent} from '../ui-elements/section-text/section-text.component';
import {SpinnerComponent} from '../ui-elements/spinner/spinner.component';
import {TitleTextComponent} from '../ui-elements/title-text/title-text.component';
import {AbstractFormComponent} from '../ui-elements/abstract-form/abstract-form.component';
import {ButtonComponent} from '../ui-elements/abstract-form/components/button/button.component';
import {CheckboxComponent} from '../ui-elements/abstract-form/components/checkbox/checkbox.component';
import {DateComponent} from '../ui-elements/abstract-form/components/date/date.component';
import {DynamicFieldDirective} from '../ui-elements/abstract-form/components/dynamic-field/dynamic-field.directive';
import {DynamicFormComponent} from '../ui-elements/abstract-form/components/dynamic-form/dynamic-form.component';
import {InputComponent} from '../ui-elements/abstract-form/components/input/input.component';
import {RadiobuttonComponent} from '../ui-elements/abstract-form/components/radiobutton/radiobutton.component';
import {SelectComponent} from '../ui-elements/abstract-form/components/select/select.component';
import {DataTableComponent} from '../ui-elements/data-table/data-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ExampleFormComponent,
    ActionButtonContainerComponent,
    InfoMessageComponent,
    LoadingWrapperComponent,
    PanelCardComponent,
    SectionTextComponent,
    SpinnerComponent,
    TitleTextComponent,
    AbstractFormComponent,
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    InputComponent,
    RadiobuttonComponent,
    SelectComponent,
    DataTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RestModule,
    FormsModule,
    ReactiveFormsModule,
    environment.production ?
      [] :
      [AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot()]
  ],
  providers: [MessageService, SnackbarService],
  bootstrap: [AppComponent],
  entryComponents: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent
  ]
})
export class AppModule {
}
