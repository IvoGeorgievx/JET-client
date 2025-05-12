import { Routes } from '@angular/router';
import { HomeComponent } from './features/components/home/home.component';
import { LoginComponent } from './features/components/login/login.component';
import { RegisterComponent } from './features/components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
