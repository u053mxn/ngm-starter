import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import 'hammerjs';

import {AppRoutingModule} from '../routing/app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from '../services/message.service';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {AkitaNgRouterStoreModule} from '@datorama/akita-ng-router-store';
import {environment} from '../../environments/environment.prod';
import {HomeComponent} from '../components/home/home.component';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {SnackbarService} from '../material/snackbar';
import {ExampleFormComponent} from '../components/example-form/example-form.component';
import {UiElementsModule} from '../ui-elements/ui-elements.module';
import {Fa5Module} from '../modules/fa5/fa5.module';
import {MAT_DIALOG_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 200,
  touchendHideDelay: 1000,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ExampleFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Fa5Module,
    UiElementsModule,
    environment.production ?
      [] :
      [AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot()]
  ],
  providers: [MessageService, SnackbarService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults
    }],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
