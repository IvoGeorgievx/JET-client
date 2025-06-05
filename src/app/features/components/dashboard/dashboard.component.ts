import { Component, effect, inject } from '@angular/core';
import { UserStore } from '@core/store/user.store';
import { WelcomeFlowComponent } from '../welcome-flow/welcome-flow.component';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionsComponent } from './transactions/transactions.component';

@Component({
  selector: 'jet-dashboard',
  imports: [
    CategoriesComponent,
    TransactionsComponent,
    TransactionHistoryComponent,
    WelcomeFlowComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  userStore = inject(UserStore);
  isFirstLogin: boolean;

  modalOpened = true;

  constructor() {
    effect(() => {
      this.isFirstLogin = this.userStore.isFirstLogin() ?? false;
    });
  }
}
