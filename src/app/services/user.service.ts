import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {Config} from '../config';
import {formDataToUrl} from '../utils/utils';
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

  getTicket(CallbackUrl) {
    const body = {
      AppID: Config.mc.AppID,
      PublicKey: Config.mc.PublicKey,
      CallbackUrl: CallbackUrl
    };
    const prams = formDataToUrl(body);
    return 'https://m.mallcoo.cn/a/open/User/V2/OAuth/BaseInfo/' + prams;
  }

  getUserToken(ticket) {
    return this.http.get(Config.prefix.api + '/mc/auth/getUserToken?ticket=' + ticket)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
