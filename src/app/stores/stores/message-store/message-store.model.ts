import {Observable} from 'rxjs';
import {StoreMessage} from '../../../shared/models/messages/store-message.model';
import {AppMessage} from '../../../shared/models/messages/app-message.model';
import {E2MessageType} from '../../../shared/models/messages/e2-message-type.enum';
import {E2Page} from '../../../shared/models/messages/e2-page.enum';


export interface IMessageStore<E extends StoreMessage, A extends AppMessage> {
    messages: Observable<E[]>;

    addMessage(appMessage: A): Observable<E>;

    addInfoMessage(appMessage: A): Observable<E>;

    addSuccessMessage(appMessage: A): Observable<E>;

    addErrorMessage(appMessage: A): Observable<E>;

    addWarningMessage(appMessage: A): Observable<E>;

    removeMessage(messageId: string): void;

    removeMessagesByType(type: E2MessageType): void;

    removeMessagesByPageType(type: E2Page[]): void;

    removeAllMessages(removePersisting: boolean): void;

    dispatchMessages(messages?: A[]): void;
}


