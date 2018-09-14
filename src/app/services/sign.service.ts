import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class SignService {

  constructor(private http: HttpClient) {
  }

  get(id?) {
    return this.http.get(Config.prefix.api + '/sign/get' + (id ? '?id=' + id : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  remove(id) {
    return this.http.post(Config.prefix.api + '/sign/remove', {id: id})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
