import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {Config} from '../config';
import {formDataToUrl, signature} from '../utils/utils';
import {StorageService} from './storage.service';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private storageSvc: StorageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  getUser() {
    const user = this.storageSvc.get('user');
    if (!user) {
      this.router.navigate(['start']);
    } else {
      return user;
    }
  }

  getLocUser() {
    return this.storageSvc.get('locUser');
  }

  getUserToken(ticket) {
    return this.http.get(Config.prefix.api + '/mc/auth/getUserToken?ticket=' + ticket)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getConfig(url) {
    return this.http.get(Config.prefix.api + '/klub/config?domain_url=' + url)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  auth(url) {
    url = encodeURIComponent(url);
    console.log(url);
    return this.http.get(Config.prefix.api + '/klub/auth?redirect_uri=' + url)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  get(id) {
    return this.http.get(Config.prefix.api + '/klub/user?union_id=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCourses(body) {
    return this.http.post(Config.prefix.api + '/klub/getCourses', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  sign(body) {
    return this.http.post(Config.prefix.api + '/klub/sign', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
