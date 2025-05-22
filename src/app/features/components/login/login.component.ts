import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserStore } from '@core/store/user.store';
import { checkInvalidFields } from '@shared/utils/form-utils';
import { tap } from 'rxjs';

@Component({
  selector: 'jet-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  userStore = inject(UserStore);

  loginForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>;

  ngOnInit(): void {
    this.initForm();
  }
  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  public handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .signIn(this.loginForm.value as { username: string; password: string })
      .pipe(tap(() => console.log('hey')))
      .subscribe({
        next: (response) => {
          this.userStore.setUser({
            id: response.user.id,
            username: response.user.username,
          });
        },
      });
  }

  public checkInvalidField(field: string): boolean {
    return checkInvalidFields(this.loginForm, field);
  }
}
