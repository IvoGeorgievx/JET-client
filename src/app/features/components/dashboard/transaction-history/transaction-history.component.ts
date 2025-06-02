import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { CategoryStore } from '@core/store/category.store';
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
  categoryStore = inject(CategoryStore);

  transactions = this.transactionStore.history.transactions;
  totalPages = this.transactionStore.history.totalPages;
  currentPage = signal<number>(1);

  transactionPeriod = TransactionPeriod;
  currentTransactionPeriod = TransactionPeriod.MONTHLY;

  categoryFilter = signal<string>('');

  activeTab = 0;

  filteredTransactions = computed(() => {
    const filter = this.categoryFilter();
    const transactions = this.transactions();
    if (!filter) return transactions;
    return transactions.filter(
      (transaction) => transaction.categoryDTO.name === filter
    );
  });

  tabs: Signal<ITabs[]> = computed(() => {
    const transactions = this.transactions();

    return [
      {
        label: 'All',
        content: this.filteredTransactions(),
      },
      {
        label: 'Expense',
        content: this.filteredTransactions().filter(
          (transaction) => transaction.type === TransactionType.EXPENSE
        ),
      },
      {
        label: 'Income',
        content: this.filteredTransactions().filter(
          (transaction) => transaction.type === TransactionType.INCOME
        ),
      },
    ];
  });

  categories = computed(() => {
    return this.categoryStore.categories();
  });

  constructor() {
    this.transactionStore.getTransactionHistory(this.currentTransactionPeriod);
  }

  changeTransactionPeriod(event: Event) {
    const transactionPeriod = (event.target as HTMLSelectElement).value;
    this.currentTransactionPeriod = transactionPeriod as TransactionPeriod;
    this.transactionStore.getTransactionHistory(
      this.currentTransactionPeriod,
      this.currentPage() - 1
    );
  }

  changeCategoryFilter(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(filter);
  }

  nextPage() {
    this.currentPage.update((value) => value + 1);
    if ((this.currentPage?.() ?? 1) > (this.totalPages?.() ?? 1)) return;
    this.transactionStore.getTransactionHistory(
      this.currentTransactionPeriod,
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
        this.currentTransactionPeriod,
        this.currentPage() - 1,
        5
      );
    }
  }
}
