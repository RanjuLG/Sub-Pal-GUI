export interface Subscription {
  id?: string;
  name: string;
  price: number;
  billingCycle: 'Monthly' | 'Yearly' | 'Weekly';
  category: string;
  renewalDate: Date | string;
  userId?: string;
}
