import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  signIn(body: {
    username: string;
    password: string;
  }): Observable<{ id: string; username: string }> {
    return this.http.post<{ id: string; username: string }>(
      'http://localhost:8081/user/sign-in',
      body
    );
  }
}
