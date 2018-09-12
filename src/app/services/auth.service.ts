import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs/index';
import {Config} from '../config';

import {StorageService} from './storage.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  public loginRedirectUrl: string;
  private loginStatus = new Subject<boolean>();

  constructor(private http: HttpClient,
              private storageSvc: StorageService) {
  }

  signIn(body): Observable<any> {
    /*body.password = Md5.init(body.password);*/
    if (this.isLogged) {
      this.logout();
    }

    return this.http.post(Config.prefix.api + '/auth/signIn', body);
  }

  signUp(body): Observable<any> {
    /*body.password = Md5.init(body.password);*/
    if (this.isLogged) {
      this.logout();
    }

    return this.http.post(Config.prefix.api + '/auth/signUp', body);
  }

  logout(): void {
    this.storageSvc.remove('user');
    this.loginStatus.next(this.isLogged);
  }

  get currentUser() {
    const user = this.storageSvc.get('user');
    return JSON.parse(user);
  }

  get isLogged(): boolean {
    this.loginStatus.next(!!this.currentUser);
    return !!this.currentUser;
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  updateLoginStatus(user) {
    this.storageSvc.set('user', JSON.stringify(user));
    this.loginStatus.next(this.isLogged);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
