import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { local } from '@shared/constants/environments';
import {
  CreateTransaction,
  OverallTransaction,
  SpendingByCategory,
  Transaction,
  TransactionPeriod,
} from '@shared/types/transaction.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  http = inject(HttpClient);

  createTransaction(data: CreateTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${local.API_URL}/transactions/new`,
      data
    );
  }

  getTransactionHistory(
    period: TransactionPeriod,
    page: number,
    perPage: number
  ): Observable<{
    transactions: Transaction[];
    total: number;
    totalPages: number;
  }> {
    return this.http.get<{
      transactions: Transaction[];
      total: number;
      totalPages: number;
    }>(`${local.API_URL}/transactions`, {
      params: {
        period,
        page,
        perPage,
      },
    });
  }

  getOverallTransaction(
    period: TransactionPeriod
  ): Observable<OverallTransaction> {
    return this.http.get<OverallTransaction>(
      `${local.API_URL}/transactions/overall`,
      {
        params: {
          period,
        },
      }
    );
  }

  getSpendingByCategory(
    period: TransactionPeriod
  ): Observable<SpendingByCategory[]> {
    return this.http.get<SpendingByCategory[]>(
      `${local.API_URL}/transactions/spending`,
      {
        params: {
          period,
        },
      }
    );
  }
}
