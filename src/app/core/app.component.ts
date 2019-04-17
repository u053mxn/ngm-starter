import {Component} from '@angular/core';
import {MessageService} from '../services/message.service';
import {SnackbarMessageType} from '../material/snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  SnackbarMessageType = SnackbarMessageType;
  constructor(private messageService: MessageService) {
  }

  message(message: string, messageType: SnackbarMessageType) {
    this.messageService.emitMessage({message: message, messageType: messageType});
  }
}
