import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:80/auth';
  private tokenSubject = new BehaviorSubject<string|null>(null);

  constructor(private http: HttpClient) {}

  public get token$(): Observable<string|null> {
    return this.tokenSubject.asObservable();
  }

  public login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
          this.tokenSubject.next(token);
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  public checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }
}