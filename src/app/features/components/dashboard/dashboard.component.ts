import { Component, effect, inject } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserStore } from '@core/store/user.store';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'jet-dashboard',
  imports: [
    CategoriesComponent,
    TransactionsComponent,
    TransactionHistoryComponent,
    ModalComponent,
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
