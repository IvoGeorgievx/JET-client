import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'jet-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<{
    username: FormControl;
    password: FormControl;
  }>;

  ngOnInit(): void {
    this.initForm();
  }
  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),
    });
  }

  handleSubmit() {
    console.log(this.loginForm.value);
  }
}
