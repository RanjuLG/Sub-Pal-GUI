import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionService } from '../subscription.service';
import { Subscription } from '../subscription.model';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['name', 'price', 'category', 'billingCycle', 'renewalDate', 'actions'];

  constructor(
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(SubscriptionFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubscriptions();
      }
    });
  }

  openEditDialog(subscription: Subscription): void {
    const dialogRef = this.dialog.open(SubscriptionFormComponent, {
      width: '500px',
      data: subscription
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubscriptions();
      }
    });
  }

  deleteSubscription(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Error deleting subscription:', error);
        }
      });
    }
  }
}
