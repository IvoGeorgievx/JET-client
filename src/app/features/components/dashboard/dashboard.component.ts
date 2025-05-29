import { Component } from '@angular/core';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionsComponent } from './transactions/transactions.component';

@Component({
  selector: 'jet-dashboard',
  imports: [
    CategoriesComponent,
    TransactionsComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
