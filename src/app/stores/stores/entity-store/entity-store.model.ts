import {Observable} from 'rxjs';

export interface IEntityStore<T> {
    entities: Observable<T[]>;

    addEntity(entity: T): void;

    setEntities(entities: T[]): void;

    removeEntity(entityId: any, idField: 'id' | string): void;

    removeAllEntities(): void;

    dispatchEntities(entities?: T[]): void;
}


