import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class VoteService {

  constructor(private http: HttpClient) {
  }

  find(owner?): Promise<any> {
    return this.http.get(Config.prefix.api + '/votes/find?owner=' + (owner ? owner : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  top(): Promise<any> {
    return this.http.get(Config.prefix.api + '/votes/top')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  vote(body): Promise<any> {
    return this.http.post(Config.prefix.api + '/votes/vote', body, {})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
