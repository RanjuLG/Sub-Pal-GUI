import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './dashboard.model';
import { AuthService } from '../../core/auth.service';
import { ChartConfiguration } from 'chart.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;

  // Chart data
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
        '#4BC0C0',
        '#FF9F40'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
        '#4BC0C0',
        '#FF9F40'
      ]
    }]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return label + ': $' + value.toFixed(2);
          }
        }
      }
    }
  };

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
        console.log('Dashboard data received:', data);
        console.log('Spending by category:', data.spendingByCategory);
        
        // Transform spendingByCategory if it's an object instead of an array
        if (data.spendingByCategory && typeof data.spendingByCategory === 'object' && !Array.isArray(data.spendingByCategory)) {
          const spendingArray = Object.entries(data.spendingByCategory).map(([category, amount]) => ({
            category,
            amount: amount as number
          }));
          data.spendingByCategory = spendingArray as any;
          console.log('Transformed spending to array:', spendingArray);
        }
        
        this.summary = data;
        this.updateChartData();
      },
      error: (error) => {
        console.error('Error loading dashboard summary:', error);
      }
    });
  }

  updateChartData(): void {
    if (this.summary?.spendingByCategory) {
      // Check if it's an array and has items
      if (Array.isArray(this.summary.spendingByCategory) && this.summary.spendingByCategory.length > 0) {
        console.log('Updating chart with data:', this.summary.spendingByCategory);
        this.doughnutChartData.labels = this.summary.spendingByCategory.map(c => c.category);
        this.doughnutChartData.datasets[0].data = this.summary.spendingByCategory.map(c => c.amount);
      } else {
        console.log('Spending data is not an array or is empty');
      }
    } else {
      console.log('No spending data available or empty array');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToSubscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }
}
