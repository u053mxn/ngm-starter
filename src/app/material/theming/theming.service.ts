import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';

export enum AppTheme {
  LIGHT = 'light-theme',
  DARK = 'dark-theme'
}

@Injectable()
export class ThemingService {
  constructor() {
  }

  static changeAppTheme(theme: AppTheme): void {
    const bodyClasses: DOMTokenList = document.body.classList;
    for (let i = 0; i < bodyClasses.length; i++) {
      const className = bodyClasses[i];
      if (className.includes('-theme')) {
        bodyClasses.remove(className);
      }
      bodyClasses.add(theme);
    }
  }
}
