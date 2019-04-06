import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

interface Params {
  [param: string]: string | string[];
}


@Injectable()
export class RestService {
  constructor() {
  }

  generateParams(params: Params) {
    return new HttpParams({fromObject: params});
  }

}

