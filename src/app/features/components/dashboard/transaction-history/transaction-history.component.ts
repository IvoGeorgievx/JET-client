import { Component, inject, signal } from '@angular/core';
import { TransactionStore } from '@core/store/transaction.store';
import { TransactionPeriod } from '@shared/types/transaction.type';

@Component({
  selector: 'jet-transaction-history',
  imports: [],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent {
  transactionStore = inject(TransactionStore);

  transactions = this.transactionStore.history.transactions;

  totalPages = this.transactionStore.history.totalPages;

  currentPage = signal<number>(1);

  nextPage() {
    this.currentPage.update((value) => value + 1);
    if ((this.currentPage?.() ?? 1) > (this.totalPages?.() ?? 1)) return;
    this.transactionStore.getTransactionHistory(
      TransactionPeriod.WEEKLY,
      this.currentPage() - 1,
      5
    );
  }

  get disableNextPage() {
    return (this.currentPage?.() ?? 1) >= (this.totalPages?.() ?? 1);
  }

  get disablePrevPage() {
    return this.currentPage() <= 1;
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((value) => value - 1);
      this.transactionStore.getTransactionHistory(
        TransactionPeriod.WEEKLY,
        this.currentPage() - 1,
        5
      );
    }
  }
}
