import {PageableResponseParameters} from './api/pageable-response-parameters';

export interface PageableDataList<T> extends PageableResponseParameters {
    content: T[];
}

