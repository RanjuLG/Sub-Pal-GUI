import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    standalone: false
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  filter: 'all' | 'unread' | 'read' = 'all';
  loading = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    switch (this.filter) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
        break;
      case 'read':
        this.filteredNotifications = this.notifications.filter(n => n.isRead);
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  setFilter(filter: 'all' | 'unread' | 'read'): void {
    this.filter = filter;
    this.applyFilter();
  }

  markAsRead(notification: Notification): void {
    if (notification.id && !notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAsUnread(notification: Notification): void {
    if (notification.id && notification.isRead) {
      this.notificationService.markAsUnread(notification.id).subscribe({
        next: () => {
          notification.isRead = false;
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error marking notification as unread:', error);
        }
      });
    }
  }

  toggleReadStatus(notification: Notification): void {
    if (notification.isRead) {
      this.markAsUnread(notification);
    } else {
      this.markAsRead(notification);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  deleteNotification(notification: Notification): void {
    if (!notification.id) return;

    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
        }
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'PAYMENT_REMINDER':
        return 'bi-bell';
      case 'PAYMENT_DUE':
        return 'bi-exclamation-circle';
      case 'PAYMENT_OVERDUE':
        return 'bi-exclamation-triangle-fill';
      default:
        return 'bi-info-circle';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'PAYMENT_REMINDER':
        return 'notification-reminder';
      case 'PAYMENT_DUE':
        return 'notification-due';
      case 'PAYMENT_OVERDUE':
        return 'notification-overdue';
      default:
        return '';
    }
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getReadCount(): number {
    return this.notifications.filter(n => n.isRead).length;
  }
}
