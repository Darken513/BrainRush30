import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:80/auth';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/login`, { email, password });
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.router.navigateByUrl('/home');
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  public getCurrentUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken
    }
    return null;
  }

  signUp(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/signup`, body);
  }
}