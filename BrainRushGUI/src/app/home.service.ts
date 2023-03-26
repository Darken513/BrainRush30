import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:80/home';

  constructor(
    private http: HttpClient
  ) { }

  public fetchGeneral(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/general`);
  }
}
