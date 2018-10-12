import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CatalogService {


  constructor(private http: HttpClient) {
  }

  get(id?) {
    return this.http.get('/api/catalog/get' + (id ? '?id=' + id : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  add(body) {
    return this.http.post('/api/catalog/add', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  edit(body) {
    return this.http.post('/api/catalog/edit', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  remove(id) {
    return this.http.post('/api/catalog/remove', {id: id})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
