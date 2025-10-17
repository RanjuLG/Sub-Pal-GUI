import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    const url = this.configService.getEndpoint('auth', 'login');
    return this.http.post<any>(url, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  register(userInfo: { name: string; email: string; password: string }): Observable<any> {
    const url = this.configService.getEndpoint('auth', 'register');
    return this.http.post<any>(url, userInfo);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch (error) {
      return false;
    }
  }
}
