import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { local } from '@shared/constants/environments';
import {
  CreateTransaction,
  OverallTransaction,
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
}
