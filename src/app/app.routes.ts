import { Routes } from '@angular/router';
import { HomeComponent } from './features/components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
];
