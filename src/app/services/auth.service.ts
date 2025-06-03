import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post('https://online-exam-service-back.onrender.com/api/login', data).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post('https://online-exam-service-back.onrender.com/api/register', data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('https://online-exam-service-back.onrender.com/api/forgot-password', { email });
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post('https://online-exam-service-back.onrender.com/api/verify-code', { email, code });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post('https://online-exam-service-back.onrender.com/api/reset-password', { email, code, newPassword });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
} 