import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  CreateTransaction,
  OverallTransaction,
  Transaction,
  TransactionPeriod,
} from './../../shared/types/transaction.type';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { TransactionService } from '@core/services/transaction.service';
import { catchError, tap } from 'rxjs';

interface ITransactionStore {
  history: {
    transactions: Transaction[];
    total?: number;
    totalPages?: number;
  };
  overallTransactions: OverallTransaction | null;
  error: null | string;
  isLoading: boolean;
}

const initialState: ITransactionStore = {
  history: {
    transactions: [],
    total: 0,
    totalPages: 0,
  },
  overallTransactions: null,
  error: null,
  isLoading: false,
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('transactions'),

  withProps(() => ({
    _transactionService: inject(TransactionService),
  })),

  withMethods((store) => ({
    getOverallTransactions: (
      period: TransactionPeriod = TransactionPeriod.WEEKLY
    ) => {
      patchState(store, {
        isLoading: true,
      });
      store._transactionService
        .getOverallTransaction(period)
        .pipe(
          tap((overallTransactions) => {
            patchState(store, {
              isLoading: false,
              overallTransactions,
            });
          }),
          catchError((error) => {
            patchState(store, {
              overallTransactions: null,
              error: error || 'Failed getting overall transactions',
            });
            throw error;
          })
        )
        .subscribe();
    },
  })),

  withMethods((store) => ({
    // if i dont create this new withMethods(), there is no access to the store.getOverallTransactions() ??
    createTransaction: (data: CreateTransaction) => {
      patchState(store, {
        isLoading: true,
      });
      store._transactionService
        .createTransaction(data)
        .pipe(
          tap((transaction) => {
            patchState(store, {
              history: {
                transactions: [...store.history.transactions(), transaction],
              },
              isLoading: false,
            });
            store.getOverallTransactions();
            // maybe should do something else rather than making another request.
          }),
          catchError((error) => {
            patchState(store, {
              error: error || 'Failed to create a new transaction.',
              isLoading: false,
            });
            throw error;
          })
        )
        .subscribe();
    },
  })),

  withMethods((store) => ({
    getTransactionHistory: (
      period: TransactionPeriod = TransactionPeriod.WEEKLY,
      page: number = 0,
      perPage: number = 5
    ) => {
      patchState(store, { isLoading: true }),
        store._transactionService
          .getTransactionHistory(period, page, perPage)
          .pipe(
            tap((data) => {
              patchState(store, {
                history: {
                  transactions: data.transactions,
                  total: data.total,
                  totalPages: data.totalPages,
                },
                isLoading: false,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error || 'Failed to get transaction history.',
                history: {
                  transactions: [],
                  total: 0,
                  totalPages: 0,
                },
              });
              throw error;
            })
          )
          .subscribe();
    },
  })),

  withHooks({
    onInit: (store) => {
      store.getOverallTransactions();
    },
  })
);
