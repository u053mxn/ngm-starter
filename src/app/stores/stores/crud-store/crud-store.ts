import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {EntityStore} from '../entity-store/entity-store';
import {ILoadingStore} from '../loading-store/loading-store.model';
import {StoreModel} from './crud-store.model';
import {map} from 'rxjs/operators';
import {StoreMessage} from '../../../models/messages/store-message.model';

export class CRUDStore<T> extends EntityStore<T> implements ILoadingStore {
    private readonly loadingSubject: BehaviorSubject<boolean>;

    constructor() {
        super();
        this.loadingSubject = new BehaviorSubject<boolean>(false);
    }

    get loading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    startLoading(): void {
        this.loadingSubject.next(true);
    }

    doneLoading(): void {
        this.loadingSubject.next(false);
    }

    get state(): Observable<StoreModel<T, StoreMessage>> {
        return combineLatest([this.entitySubject, this.messageSubject, this.loadingSubject]).pipe(map(arr => {
            return {
                entities: arr[0],
                messages: arr[1],
                loading: arr[2]
            };
        }));
    }

    clearState(): void {
        // TODO Implement some way that this will not cause the state to emit 3 times
        this.removeAllEntities();
        this.removeAllMessages();
        this.doneLoading();
    }

}
