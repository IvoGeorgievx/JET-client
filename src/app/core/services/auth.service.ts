import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { local } from '@shared/constants/environments';
import {
  LoginResponse,
  RegisterResponse,
} from '@shared/types/auth-response.type';
import { User } from '@shared/types/user.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { UserStore } from '@core/store/user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);
  private router = inject(Router);

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${local.API_URL}/user/info`);
  }

  signIn(body: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${local.API_URL}/user/sign-in`, body)
      .pipe(
        tap((response) => {
          this.localStorageService.setItem('token', response.token);
          this.router.navigate(['dashboard']);
        }),
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      );
  }

  signUp(body: {
    username: string;
    password: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${local.API_URL}/user/sign-up`,
      body
    );
  }
}
