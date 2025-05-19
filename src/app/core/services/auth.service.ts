import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  LoginResponse,
  RegisterResponse,
} from '@shared/types/auth-response.type';
import { User } from '@shared/types/user.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);

  private currentUserSignal = signal<User | null | undefined>(undefined);
  public currentUser = computed(() => this.currentUserSignal());
  public isLoggedIn = computed(() => !!this.currentUserSignal());

  signIn(body: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:8081/user/sign-in', body)
      .pipe(
        tap((response) => {
          this.currentUserSignal.set({
            id: response.user.id,
            username: response.user.username,
          });
          this.localStorageService.setItem('token', response.token);
        }),
        catchError((error) => {
          this.currentUserSignal.set(null);
          console.error(error);
          return throwError(() => error);
        })
      );
  }

  signOut(): void {
    this.currentUserSignal.set(null);
    this.localStorageService.removeItem('token');
  }

  signUp(body: {
    username: string;
    password: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      'http://localhost:8081/user/sign-up',
      body
    );
  }
}
