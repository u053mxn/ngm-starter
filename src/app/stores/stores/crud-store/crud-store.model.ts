import {Observable} from 'rxjs';
import {AppMessage} from '../../../shared/models/messages/app-message.model';
import {StoreMessage} from '../../../shared/models/messages/store-message.model';
import {IEntityStore} from '../entity-store/entity-store.model';
import {IMessageStore} from '../message-store/message-store.model';
import {ILoadingStore} from '../loading-store/loading-store.model';


export interface StoreModel<T, E> {
    entities: T[];
    messages: E[];
    loading: boolean;
}

export interface ICRUDStore<T, E> extends IEntityStore<T>, IMessageStore<StoreMessage, AppMessage>, ILoadingStore {
    state: Observable<StoreModel<T, E>>;
    clearState(): void;
}


