import { NgModule, ModuleWithProviders } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@NgModule({
  })
  export class SnackbarModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: SnackbarModule,
        providers: [ SnackbarService ]
      };
    }
  }
