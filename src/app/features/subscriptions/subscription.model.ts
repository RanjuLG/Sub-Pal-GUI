export interface Subscription {
  id?: string;
  name: string;
  price: number;
  billingCycle: 'Monthly' | 'Yearly' | 'Weekly';
  category: string;
  nextRenewalDate: Date | string;
  userId?: string;
  
  // Notification settings
  notificationEnabled?: boolean;
  notificationDaysBefore?: number;
  notificationMessage?: string;
}
