import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { checkInvalidFields } from '@shared/utils/form-utils';

@Component({
  selector: 'jet-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup<{
    username: FormControl;
    password: FormControl;
  }>;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  handleRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.registerForm.value;

    this.authService.signUp({ username, password }).subscribe({
      next: () => this.router.navigate(['login']),
    });
  }

  public checkInvalidField(field: string): boolean {
    return checkInvalidFields(this.registerForm, field);
  }
}
