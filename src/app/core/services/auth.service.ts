import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse | string> {
    return this.http.post<LoginResponse | string>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const token = typeof res === 'string' ? res : (res as LoginResponse).token;
        const user = typeof res === 'object' && res !== null && 'user' in res ? (res as LoginResponse).user : null;
        if (token) this.setSession(token, user);
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? 'student',
    };
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, body).pipe(
      tap((user) => {
        if (user) {
          const role = user.role ?? 'student';
          this.setSession('', { id: user.id, name: user.name, email: user.email, role });
        }
      })
    );
  }

  private setSession(token: string, user: LoginResponse['user'] | null): void {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): LoginResponse['user'] | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() || !!this.getUser();
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return (user?.role ?? '').toLowerCase() === role.toLowerCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}
