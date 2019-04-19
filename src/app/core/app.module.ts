import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import 'hammerjs';

import {AppRoutingModule} from '../routing/app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from '../services/message.service';
import {RestModule} from '../modules/rest';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {AkitaNgRouterStoreModule} from '@datorama/akita-ng-router-store';
import {environment} from '../../environments/environment.prod';
import {HomeComponent} from '../components/home/home.component';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {SnackbarService} from '../material/snackbar';
import {ExampleFormComponent} from '../components/example-form/example-form.component';
import {UiElementsModule} from '../ui-elements/ui-elements.module';

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
    RestModule,
    UiElementsModule,
    environment.production ?
      [] :
      [AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot()]
  ],
  providers: [MessageService, SnackbarService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
