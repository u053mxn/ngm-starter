import { Injectable } from '@angular/core';
import {concatMap, delay, retryWhen, tap, timeout} from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse, HttpHeaders, HttpParams
} from '@angular/common/http';
import {iif, Observable, of, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

interface Params {
  [param: string]: string | string[];
}

const BASEURL = environment.baseUrl;
const RETRY_COUNT = environment.retryCount;
const TIMEOUT = environment.timeout;

@Injectable()
export class RestInterceptor implements HttpInterceptor {
  constructor() { }
  // function which will be called for all http calls
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // how to update the request Parameters
    // const updatedRequest = request.clone({
    //   headers: this.addAuthHeader(request.headers),
    //   url: this.updateUrl(request.url)
    // });

    // logging the updated Parameters to browser's console
    console.log('Before making api call : ', request);
    return next.handle(request).pipe(
      timeout(TIMEOUT),
      retryWhen(errors => errors.pipe(
        tap(() => console.log(`Retry for ${request.urlWithParams}`)),
        // Use concat map to keep the errors in order and make sure they
        // aren't executed in parallel
        concatMap((e: HttpErrorResponse, i) =>
          // Executes a conditional Observable depending on the result
          // of the first argument
          iif(
            () => i > RETRY_COUNT - 1 || e.status === 401,
            // If the condition is true we throw the error (the last error)
            throwError(e),
            // Otherwise we pipe this back into our stream and delay the retry
            of(e).pipe(delay(500))
          )
        )
      ))
    );
  }

  addAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = `Bearer ${sessionStorage.getItem('token')}`;
    const header = {Authorization: token};
    if (headers && !token.includes('null')) {
        headers = headers.set('Authorization', token);
      } else if (!headers && !token.includes('null')) {
        headers = new HttpHeaders(header);
      }
    return headers;
    }

  generateParams(params: Params) {
    return new HttpParams({fromObject: params});
  }

  updateUrl(url) {
    return !(url.includes('http://') || url.includes('https://') || url.includes('en.json')) ? `${BASEURL}${url}` : url;
  }
}
