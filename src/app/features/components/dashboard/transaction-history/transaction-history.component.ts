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
import { CategoryBudgetPeriod } from '@shared/types/category.type';
import {
  Transaction,
  TransactionPeriod,
  TransactionType,
} from '@shared/types/transaction.type';
import { AgCharts } from 'ag-charts-angular';
import {
  AgBarSeriesOptions,
  AgChartOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';

interface ITabs {
  label: string;
  content: Transaction[];
}
@Component({
  selector: 'jet-transaction-history',
  imports: [CommonModule, AgCharts],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css',
})
export class TransactionHistoryComponent {
  transactionStore = inject(TransactionStore);
  categoryStore = inject(CategoryStore);

  transactions = this.transactionStore.history.transactions;
  totalPages = this.transactionStore.history.totalPages;
  currentPage = signal<number>(1);

  spendingByCategory = this.transactionStore.spendingByCategory;

  transactionPeriod = TransactionPeriod;
  currentTransactionPeriod = TransactionPeriod.MONTHLY;

  constructor() {
    this.transactionStore.getTransactionHistory(this.currentTransactionPeriod);
  }

  highestIncome = computed(() => {
    const categories = this.spendingByCategory();
    if (!categories.length) return null;
    const maxCategory = categories.reduce((max, curr) =>
      curr.income > max.income ? curr : max
    );
    return {
      categoryName: maxCategory.categoryName,
      net: Number(maxCategory.income.toFixed(2)),
    };
  });

  highestExpense = computed(() => {
    const categories = this.spendingByCategory();
    if (!categories.length) return null;
    const maxCategory = categories.reduce((max, curr) =>
      curr.expense > max.expense ? curr : max
    );
    return {
      categoryName: maxCategory.categoryName,
      net: Number(maxCategory.expense.toFixed(2)),
    };
  });

  categoryFilter = signal<string>('');

  protected options = computed((): AgChartOptions => {
    return {
      width: 600,
      height: 600,
      data: this.spendingByCategory().map((category) => ({
        asset: category.categoryName,
        income: category.income,
        expense: category.expense,
        net: Number((category.income - category.expense).toFixed(2)),
      })),
      title: {
        text: 'Income - Expense by Category',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5b21b6',
      },
      background: {
        fill: '#ffffff',
      },
      series: [
        {
          type: 'bar',
          xKey: 'asset',
          yKey: 'net',
          label: {
            enabled: true,
            formatter: ({ value }) => value.toFixed(2),
            color: '#ffffff',
            fontWeight: 'bold',
          },
          fill: '#8b5cf6',
          fillOpacity: 0.9,
          stroke: '#5b21b6',
          strokeWidth: 2,
          shadow: {
            color: 'rgba(91, 33, 182, 0.3)',
            xOffset: 3,
            yOffset: 3,
            blur: 12,
          },
          highlightStyle: {
            item: {
              fill: '#a78bfa',
              stroke: '#5b21b6',
              strokeWidth: 2,
            },
          },
        } as AgBarSeriesOptions,
        { type: 'line', xKey: 'net' } as AgLineSeriesOptions,
      ],
      legend: {
        position: 'bottom',
      },
    };
  });

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

  changeTransactionPeriod(event: Event) {
    const transactionPeriod = (event.target as HTMLSelectElement).value;
    this.currentTransactionPeriod = transactionPeriod as TransactionPeriod;
    this.transactionStore.getTransactionHistory(
      this.currentTransactionPeriod,
      this.currentPage() - 1
    );
  }

  changeSpendingPeriod(event: Event) {
    const period = (event.target as HTMLSelectElement)
      .value as TransactionPeriod;

    if (period) {
      this.transactionStore.getSpendingByCategory(period);
    } else {
      this.transactionStore.getSpendingByCategory();
    }
  }

  changeCategoryFilter(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(filter);
  }

  checkBudgetLimit(transaction: Transaction) {
    if (!transaction.categoryDTO.budget) {
      return;
    }

    const budget = transaction.categoryDTO.budget;
    const budgetPeriod = transaction.categoryDTO.budgetPeriod;
    const transactionCreatedAt = new Date(transaction.createdAt);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const isSameWeek = (a: Date, b: Date) => {
      const startOfWeek = (d: Date) => {
        const s = new Date(d);
        s.setHours(0, 0, 0, 0);
        s.setDate(s.getDate() - s.getDay());
        return s;
      };
      return (
        startOfWeek(a).getTime() === startOfWeek(b).getTime() &&
        a.getFullYear() === b.getFullYear()
      );
    };

    const isSameMonth = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

    let filtered = this.transactions().filter(
      (t) => t.categoryDTO.name === transaction.categoryDTO.name
    );

    switch (budgetPeriod) {
      case CategoryBudgetPeriod.DAILY:
        filtered = filtered.filter((t) =>
          isSameDay(new Date(t.createdAt), transactionCreatedAt)
        );
        break;
      case CategoryBudgetPeriod.WEEKLY:
        filtered = filtered.filter((t) =>
          isSameWeek(new Date(t.createdAt), transactionCreatedAt)
        );
        break;
      case CategoryBudgetPeriod.MONTHLY:
        filtered = filtered.filter((t) =>
          isSameMonth(new Date(t.createdAt), transactionCreatedAt)
        );
        break;
      default:
        break;
    }

    const transactionSum = filtered.reduce((sum, t) => sum + t.amount, 0);

    return budget >= transactionSum;
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
