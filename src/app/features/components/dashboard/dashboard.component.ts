import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'jet-dashboard',
  imports: [CategoriesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
