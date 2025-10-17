import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../subscription.service';
import { Subscription } from '../subscription.model';

@Component({
    selector: 'app-subscription-list',
    templateUrl: './subscription-list.component.html',
    styleUrls: ['./subscription-list.component.css'],
    standalone: false
})
export class SubscriptionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  showAddForm = false;
  selectedSubscription: Subscription | null = null;

  constructor(
    private subscriptionService: SubscriptionService
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

  editSubscription(subscription: Subscription): void {
    this.selectedSubscription = subscription;
    this.showAddForm = false;
  }

  closeForm(): void {
    this.showAddForm = false;
    this.selectedSubscription = null;
  }

  onFormSubmit(): void {
    this.closeForm();
    this.loadSubscriptions();
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
