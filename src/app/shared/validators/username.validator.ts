import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsernameValidator implements AsyncValidator {
  private authService = inject(AuthService);

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() =>
        this.authService.checkUsernameAvailability(control.value).pipe(
          map((response) => {
            return response.available ? null : { usernameTaken: true };
          }),
          catchError((error) => {
            return of(null);
          })
        )
      )
    );
  }
}
