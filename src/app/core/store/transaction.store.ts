import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  CreateTransaction,
  OverallTransaction,
  Transaction,
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
  transactions: Transaction[];
  overallTransactions: OverallTransaction | null;
  error: null | string;
  isLoading: boolean;
}

const initialState: ITransactionStore = {
  transactions: [],
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
    getOverallTransactions: () => {
      patchState(store, {
        isLoading: true,
      });
      store._transactionService
        .getOverallTransaction()
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
              transactions: [...store.transactions(), transaction],
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

  withHooks({
    onInit: (store) => {
      store.getOverallTransactions();
    },
  })
);
