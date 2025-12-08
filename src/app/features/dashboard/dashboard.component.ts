import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './dashboard.model';
import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  summary: DashboardSummary | null = null;
  private themeSubscription?: Subscription;

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
    maintainAspectRatio: false,
    cutout: '70%', // Thinner donut for modern look
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 11
          },
          color: '#6b7280' // Default color
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 5 // Rounded corners for segments
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSummary();
    
    // Subscribe to theme changes to update chart colors
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.updateChartTheme(theme);
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  updateChartTheme(theme: string): void {
    if (this.doughnutChartOptions?.plugins?.legend?.labels) {
      // Set legend color based on theme
      // Light theme: #6b7280 (gray-500), Dark theme: #d1d5db (gray-300)
      this.doughnutChartOptions.plugins.legend.labels.color = theme === 'dark' ? '#d1d5db' : '#6b7280';
      
      // Update chart border color for segments
      if (this.doughnutChartOptions.elements?.arc) {
        this.doughnutChartOptions.elements.arc.borderColor = theme === 'dark' ? '#1f2937' : '#fff';
      }
      
      // Force chart update
      if (this.chart) {
        this.chart.update();
      }
    }
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
        
        if (this.chart) {
          this.chart.update();
        }
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
