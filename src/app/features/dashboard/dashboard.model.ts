export interface DashboardSummary {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  spendingByCategory: CategorySpending[];
  upcomingRenewals: UpcomingRenewal[];
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface UpcomingRenewal {
  name: string;
  nextRenewalDate: Date | string;
  price: number;
}
