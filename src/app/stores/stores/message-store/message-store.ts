import {BehaviorSubject, Observable, of} from 'rxjs';
import * as _ from 'lodash';
import {AppMessage} from '../../../shared/models/messages/app-message.model';
import {StoreMessage} from '../../../shared/models/messages/store-message.model';
import {E2MessageType} from '../../../shared/models/messages/e2-message-type.enum';
import {E2Page} from '../../../shared/models/messages/e2-page.enum';
import {E2Log} from '../../logging/e2-log.service';
import {IMessageStore} from './message-store.model';

export class MessageStore implements IMessageStore<StoreMessage, AppMessage> {
    protected readonly messageSubject: BehaviorSubject<StoreMessage[]>;

    constructor() {
        this.messageSubject = new BehaviorSubject<StoreMessage[]>([]);
    }

    get messages(): Observable<StoreMessage[]> {
        return this.messageSubject.asObservable();
    }

    get rawMessages(): StoreMessage[] {
        return _.cloneDeep(this.messageSubject.value);
    }

    addMessage(appMessage: AppMessage): Observable<StoreMessage> {
        E2Log.info(`Adding message ${appMessage.message}`);
        if (!appMessage.type) {
            E2Log.info('Message not given type. Setting to info message as default');
            appMessage.type = E2MessageType.INFO;
        }
        const date = new Date();
        const time = date.toLocaleString();
        let ms = date.getTime().toString(10);
        ms = ms.slice(ms.length - 3, ms.length);
        const ts = this.insertString(time, `.${ms}`, time.length - 3);
        const storeError: StoreMessage = {
            ...appMessage,
            timestamp: ts,
            id: this.generateId(ts + appMessage.message + appMessage.title + appMessage.type) + this.randomString()
        };
        const messages = this.rawMessages;
        messages.push(storeError);
        this.dispatchMessages(messages);
        return of(storeError);
    }

    addInfoMessage(appMessage: AppMessage) {
        appMessage.type = E2MessageType.INFO;
        return this.addMessage(appMessage);
    }

    addSuccessMessage(appMessage: AppMessage) {
        appMessage.type = E2MessageType.SUCCESS;
        return this.addMessage(appMessage);
    }

    addErrorMessage(appMessage: AppMessage) {
        appMessage.type = E2MessageType.ERROR;
        return this.addMessage(appMessage);
    }

    addWarningMessage(appMessage: AppMessage) {
        appMessage.type = E2MessageType.WARNING;
        return this.addMessage(appMessage);
    }

    removeMessage(messageId: string, removePersisting = false): void {
        const messages = this.rawMessages;
        const i = messages.findIndex(m => m.id === messageId);
        if (i === -1) {
            throw new Error(`Could not find message with id: ${messageId}`);
        }
        if (!removePersisting && messages[i].persistOnDestroy) {
            throw new Error('Could not remove message. It is set to persist on destroy. Pass in extra parameter to remove');
        }
        messages.splice(i, 1);
        this.dispatchMessages(messages);
    }

    removeMessagesByType(type: E2MessageType, removePersisting = false): void {
        const messages = this.rawMessages.filter(m => m.type !== type || (m.persistOnDestroy && !removePersisting));
        this.dispatchMessages(messages);
    }

    removeMessagesByPageType(pagesToClear: E2Page[], removePersisting = false): void {
        const messages = this.rawMessages.filter(m => (m.persistOnDestroy && !removePersisting) ||
            !m.pageScopes.map(page => pagesToClear.includes(page)).includes(true));
        this.dispatchMessages(messages);
    }

    removeAllMessages(removePersisting = false): void {
        const messages = removePersisting ? [] : this.rawMessages.filter(m => m.persistOnDestroy);
        this.dispatchMessages(messages);
    }

    dispatchMessages(messages?: StoreMessage[]): void {
        !!messages ? this.messageSubject.next(_.cloneDeep(messages)) : this.messageSubject.next(this.rawMessages);
    }

    private generateId(s: string): string {
        let h: number;
        for (let i = 0; i < s.length; i++) {
            // tslint:disable-next-line:no-bitwise
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h.toString(10);
    }

    private insertString(string: string, stringToInsert = '', pos = 0): string {
        return string.slice(0, pos) + stringToInsert + string.slice(pos);
    }

    private randomString(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
