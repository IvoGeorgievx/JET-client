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
}

export interface Transaction extends BaseTransaction {
  id: string;
  userId: string;
  categoryDTO: Category;
}

export interface CreateTransaction extends BaseTransaction {
  categoryId: string;
}

export interface OverallTransaction {
  income: number;
  expense: number;
  period: TransactionPeriod;
}
