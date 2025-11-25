import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { ThemeService } from './core/theme.service';
import { NotificationService } from './features/notifications/notification.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'Sub-Pal-GUI';
  unreadNotificationCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    public themeService: ThemeService
  ) {
    this.unreadNotificationCount$ = this.notificationService.unreadCount$;
    
    // Load unread count if user is logged in
    if (this.authService.isLoggedIn()) {
      this.notificationService.loadUnreadCount();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.getCurrentTheme() === 'dark';
  }
}
