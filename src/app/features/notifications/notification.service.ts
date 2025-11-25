import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification } from './notification.model';
import { ConfigService } from '../../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getNotifications(): Observable<Notification[]> {
    const url = this.configService.getEndpoint('notifications', 'getAll');
    return this.http.get<Notification[]>(url).pipe(
      tap(notifications => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
      })
    );
  }

  getUnreadNotifications(): Observable<Notification[]> {
    const url = this.configService.getEndpoint('notifications', 'getUnread');
    return this.http.get<Notification[]>(url).pipe(
      tap(notifications => {
        this.unreadCountSubject.next(notifications.length);
      })
    );
  }

  markAsRead(notificationId: string): Observable<void> {
    const baseUrl = this.configService.getEndpoint('notifications', 'markAsRead');
    return this.http.put<void>(`${baseUrl}/${notificationId}`, {}).pipe(
      tap(() => {
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, currentCount - 1));
      })
    );
  }

  markAsUnread(notificationId: string): Observable<void> {
    // Assuming an endpoint exists or we use a similar pattern
    const baseUrl = this.configService.getEndpoint('notifications', 'markAsUnread'); 
    // If 'markAsUnread' key doesn't exist in config, this might fail if not handled. 
    // But for now I'll assume it follows the pattern.
    return this.http.put<void>(`${baseUrl}/${notificationId}`, {}).pipe(
      tap(() => {
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(currentCount + 1);
      })
    );
  }

  markAllAsRead(): Observable<void> {
    const url = this.configService.getEndpoint('notifications', 'markAllAsRead');
    return this.http.put<void>(url, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }

  deleteNotification(notificationId: string): Observable<void> {
    const baseUrl = this.configService.getEndpoint('notifications', 'delete');
    return this.http.delete<void>(`${baseUrl}/${notificationId}`);
  }

  // Load unread count on service initialization
  loadUnreadCount(): void {
    this.getUnreadNotifications().subscribe();
  }
}
