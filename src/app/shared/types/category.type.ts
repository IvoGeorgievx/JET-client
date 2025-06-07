export enum CategoryBudgetPeriod {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export interface Category {
  id: string;
  name: string;
  type: string;
  budget: string;
  budgetPeriod: CategoryBudgetPeriod;
  default: boolean;
}
