import {NgModule, ModuleWithProviders} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RestService} from './rest.service';
import {RestInterceptor} from './rest.interceptor';

@NgModule({
  imports: [
    HttpClientModule,
  ]
})
export class RestModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RestModule,
      providers: [RestService, {
        provide: HTTP_INTERCEPTORS,
        useClass: RestInterceptor,
        multi: true
      }]
    };
  }
}
