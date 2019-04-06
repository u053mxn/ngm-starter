import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';

export enum SnackbarMessageType {
  ERROR = 'snackbar-error',
  WARN = 'snackbar-warn',
  INFO = 'snackbar-info',
  SUCCESS = 'snackbar-success'
}

@Injectable()
export class SnackbarService {
  snackbarRef: MatSnackBarRef<SimpleSnackBar>;
  overlay;

  constructor(private snackBar: MatSnackBar, private overlayContainer: OverlayContainer) {
    this.overlay = overlayContainer.getContainerElement();
  }

  open(message: string, action: string, duration: number, theme?: SnackbarMessageType) {
    if (!theme) {
      this.clearSnackbarThemes();
    } else {
      this.addSnackbarTheme(theme);
    }
    this.snackbarRef = this.snackBar.open(message, action, {
      duration: duration,
    });
  }


  private addSnackbarTheme(themeToAdd: SnackbarMessageType) {
    const classItems = [];
    for (const classItem of this.overlay.classList) {
      if (classItem.includes('snackbar')) {
        classItems.push(classItem);
      }
    }
    const snackbarClass = classItems[0];
    if (classItems.length === 1 && themeToAdd !== snackbarClass) {
      this.overlay.classList.remove(snackbarClass);
      this.overlay.classList.add(themeToAdd);
    } else {
      this.clearSnackbarThemes();
      this.overlay.classList.add(themeToAdd);
    }
  }

  private clearSnackbarThemes() {
    for (const classItem of this.overlay.classList) {
      if (classItem.includes('snackbar')) {
        this.overlay.classList.remove(classItem);
      }
    }
  }
}
