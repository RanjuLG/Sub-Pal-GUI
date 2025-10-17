import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionService } from '../subscription.service';
import { Subscription } from '../subscription.model';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css']
})
export class SubscriptionFormComponent implements OnInit {
  subscriptionForm!: FormGroup;
  isEdit = false;
  billingCycles = ['Monthly', 'Yearly', 'Weekly'];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    public dialogRef: MatDialogRef<SubscriptionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Subscription | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.subscriptionForm = this.fb.group({
      name: [this.data?.name || '', [Validators.required]],
      price: [this.data?.price || 0, [Validators.required, Validators.min(0)]],
      billingCycle: [this.data?.billingCycle || 'Monthly', [Validators.required]],
      category: [this.data?.category || '', [Validators.required]],
      renewalDate: [this.data?.renewalDate ? new Date(this.data.renewalDate) : new Date(), [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      const subscription: Subscription = {
        ...this.subscriptionForm.value,
        id: this.data?.id
      };

      const request = this.isEdit
        ? this.subscriptionService.updateSubscription(subscription)
        : this.subscriptionService.addSubscription(subscription);

      request.subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving subscription:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
