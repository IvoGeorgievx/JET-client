import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'jet-dashboard',
  imports: [
    CategoriesComponent,
    TransactionsComponent,
    TransactionHistoryComponent,
    ToastComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
