import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TransactionStore } from '@core/store/transaction.store';
import {
  Transaction,
  TransactionPeriod,
  TransactionType,
} from '@shared/types/transaction.type';

interface ITabs {
  label: string;
  content: Transaction[];
}
@Component({
  selector: 'jet-transaction-history',
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent {
  transactionStore = inject(TransactionStore);

  transactions = this.transactionStore.history.transactions;

  totalPages = this.transactionStore.history.totalPages;

  currentPage = signal<number>(1);

  activeTab = 0;

  tabs: Signal<ITabs[]> = computed(() => {
    const transactions = this.transactions();

    return [
      {
        label: 'All',
        content: transactions,
      },
      {
        label: 'Expense',
        content: transactions.filter(
          (transaction) => transaction.type === TransactionType.EXPENSE
        ),
      },
      {
        label: 'Income',
        content: transactions.filter(
          (transaction) => transaction.type === TransactionType.INCOME
        ),
      },
    ];
  });

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
