import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class CityService {


  constructor(private http: HttpClient) {
  }

  get(id?) {
    console.log(Config.prefix.api + '/city/get' + (id ? '&id=' + id : ''));
    return this.http.get(Config.prefix.api + '/city/get' + (id ? '?id=' + id : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  add(body) {
    return this.http.post(Config.prefix.api + '/city/add', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  edit(body) {
    return this.http.post(Config.prefix.api + '/city/edit', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
