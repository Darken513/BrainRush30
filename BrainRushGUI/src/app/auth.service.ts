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
  public saveConf(username:string, NotifDate:string, design_mode:boolean){
    return this.http.post<{ response: any }>(`${this.apiUrl}/conf/${this.getCurrentUser().id}`, {username, NotifDate, design_mode});
  }
  public setToken(token: string, dontNav?:boolean): void {
    localStorage.setItem('token', token);
    if(dontNav) return;
    this.router.navigateByUrl('/home');
    if(this.getCurrentUser().design_mode){
      document.body.style.filter = "none"
      return;
    }
    document.body.style.filter = "invert(1) hue-rotate(60deg)"
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

  signUp(email: string, password: string, username:string): Observable<any> {
    const body = { email, password, username };
    return this.http.post<any>(`${this.apiUrl}/signup`, body);
  }
}