import { Category } from './category.type';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionPeriod {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

interface BaseTransaction {
  amount: number;
  description: string;
  type: TransactionType;
  categoryId: string;
}

export interface Transaction extends BaseTransaction {
  id: string;
  userId: string;
}

export interface CreateTransaction extends BaseTransaction {}

export interface OverallTransaction {
  income: number;
  expense: number;
  period: TransactionPeriod;
}
