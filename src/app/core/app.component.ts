import {Component} from '@angular/core';
import {MessageService} from '../services/message.service';
import {SnackbarMessageType} from '../material/snackbar/snackbar.service';
import {AppTheme, ThemingService} from '../material/theming/theming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  SnackbarMessageType = SnackbarMessageType;
  AppTheme = AppTheme;

  constructor(private messageService: MessageService) {
  }

  message(message: string, messageType: SnackbarMessageType) {
    this.messageService.emitMessage({message: message, messageType: messageType});
  }

  changeTheme(theme: AppTheme) {
    ThemingService.changeAppTheme(theme);
  }
}
