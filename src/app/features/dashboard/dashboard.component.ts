import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './dashboard.model';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Error loading dashboard summary:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }
}
