import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDatepickerModule, MatExpansionModule,
  MatFormFieldModule, MatGridListModule, MatIconModule,
  MatInputModule, MatNativeDateModule,
  MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule,
  MatSnackBarModule, MatSortModule, MatTableModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {SnackbarModule} from './snackbar';
import {ThemingService} from './theming/theming.service';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSidenavModule,
    SnackbarModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSidenavModule,
    SnackbarModule
  ],
  providers: [ThemingService]
})
export class MaterialModule {
}
