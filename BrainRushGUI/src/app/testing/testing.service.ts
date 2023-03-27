import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestingService {
  private apiUrl = 'http://localhost:80/test';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public generateTest(day: number): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/generate/${day}`);
  }
  public getTestReview(test_id: number): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/review/${test_id}`);
  }
  public gradeTest(testRes: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/grade`, testRes);
  }
}
