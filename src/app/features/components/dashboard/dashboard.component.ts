import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionsComponent } from './transactions/transactions.component';

@Component({
  selector: 'jet-dashboard',
  imports: [CategoriesComponent, TransactionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
