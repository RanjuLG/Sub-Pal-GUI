import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from '../subscription.service';
import { Subscription } from '../subscription.model';
import { DateUtilsService } from '../../../shared/date-utils.service';

@Component({
    selector: 'app-subscription-form',
    templateUrl: './subscription-form.component.html',
    styleUrls: ['./subscription-form.component.css'],
    standalone: false
})
export class SubscriptionFormComponent implements OnInit {
  @Input() subscription: Subscription | null = null;
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  subscriptionForm!: FormGroup;
  isEdit = false;
  billingCycles = ['Monthly', 'Yearly', 'Weekly'];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private dateUtils: DateUtilsService
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.subscription;
    
    // Convert date string to YYYY-MM-DD format for input[type="date"]
    let dateValue = '';
    if (this.subscription?.nextRenewalDate) {
      const date = new Date(this.subscription.nextRenewalDate);
      dateValue = date.toISOString().split('T')[0];
    } else {
      const today = new Date();
      dateValue = today.toISOString().split('T')[0];
    }

    this.subscriptionForm = this.fb.group({
      name: [this.subscription?.name || '', [Validators.required]],
      price: [this.subscription?.price || 0, [Validators.required, Validators.min(0)]],
      billingCycle: [this.subscription?.billingCycle || 'Monthly', [Validators.required]],
      category: [this.subscription?.category || '', [Validators.required]],
      nextRenewalDate: [dateValue, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      const formValue = this.subscriptionForm.value;
      
      // Convert date input to ISO string
      const subscription: Subscription = {
        ...formValue,
        nextRenewalDate: new Date(formValue.nextRenewalDate).toISOString(),
        id: this.subscription?.id
      };

      const request = this.isEdit
        ? this.subscriptionService.updateSubscription(subscription)
        : this.subscriptionService.addSubscription(subscription);

      request.subscribe({
        next: () => {
          this.formSubmit.emit();
        },
        error: (error) => {
          console.error('Error saving subscription:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
