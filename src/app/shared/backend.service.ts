import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BackendService {
  baseUrl = 'http://localhost:5000/api/v1.0/';

  constructor(private http: HttpClient) {
  }


}
