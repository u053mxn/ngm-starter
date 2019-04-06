import {Injectable} from '@angular/core';
import {SnackbarMessageType, SnackbarService} from '../material/snackbar/snackbar.service';

export interface MessageInstance {
  message: string;
  messageType: SnackbarMessageType;
}

export interface MessageLogInstance {
  message: string;
  messageType: SnackbarMessageType;
  timestamp: string;
}

@Injectable()
export class MessageService {

  messages: MessageLogInstance[] = [];

  constructor(private snackbarService: SnackbarService) {
  }

  emitMessage(messageInstance: MessageInstance, duration = 20000) {
    this.snackbarService.open(messageInstance.message, 'CLOSE', duration, messageInstance.messageType);
    this.messages.push({
      message: messageInstance.message,
      messageType: messageInstance.messageType,
      timestamp: new Date(Date.now()).toLocaleString()
    });
  }

  emitError(message: string, duration = 20000) {
    this.emitMessage({
      message,
      messageType: SnackbarMessageType.ERROR
    }, duration);
  }

  emitWarn(message: string, duration = 20000) {
    this.emitMessage({
      message,
      messageType: SnackbarMessageType.WARN
    }, duration);
  }

  emitInfo(message: string, duration = 20000) {
    this.emitMessage({
      message,
      messageType: SnackbarMessageType.INFO
    }, duration);
  }

  emitSuccess(message: string, duration = 20000) {
    this.emitMessage({
      message,
      messageType: SnackbarMessageType.SUCCESS
    }, duration);
  }
}
