import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
// Lottery;
@Injectable({providedIn: 'root'})
export class ActivityService {

  constructor(private http: HttpClient) {
  }

  get(): Promise<any> {
    return this.http.get(Config.prefix.api + '/activities/getActivities')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
