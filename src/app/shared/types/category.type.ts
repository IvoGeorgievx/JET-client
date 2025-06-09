export enum CategoryBudgetPeriod {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export interface Category {
  id: string;
  name: string;
  type: string;
  budget: number;
  budgetPeriod: CategoryBudgetPeriod;
  default: boolean;
}
