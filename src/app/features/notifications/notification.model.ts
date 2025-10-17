export interface Notification {
  id?: string;
  subscriptionId: string;
  subscriptionName: string;
  message: string;
  description?: string;
  dueDate: Date | string;
  isRead: boolean;
  createdAt: Date | string;
  notificationType: 'PAYMENT_REMINDER' | 'PAYMENT_DUE' | 'PAYMENT_OVERDUE';
}

export interface NotificationPreference {
  enabled: boolean;
  daysBeforeReminder: number;
  customMessage?: string;
}

export interface CreateNotificationDto {
  subscriptionId: string;
  message: string;
  description?: string;
  dueDate: Date | string;
}
