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
  categories: string[] = [];
  showCustomCategoryInput = false;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private dateUtils: DateUtilsService
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.subscription;
    this.loadCategories();
    
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
      nextRenewalDate: [dateValue, [Validators.required]],
      notificationEnabled: [this.subscription?.notificationEnabled || false],
      notificationDaysBefore: [this.subscription?.notificationDaysBefore || 3, [Validators.min(0), Validators.max(30)]],
      notificationMessage: [this.subscription?.notificationMessage || '']
    });

    // If editing and has a category, check if it's in the list or is custom
    if (this.subscription?.category) {
      // Show custom input if category is set but not in list yet
      this.showCustomCategoryInput = true;
    }
  }

  onCategorySelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (value === '__custom__') {
      // Show custom input field
      this.showCustomCategoryInput = true;
      this.subscriptionForm.patchValue({ category: '' });
    } else if (value === '') {
      // No selection
      this.showCustomCategoryInput = false;
      this.subscriptionForm.patchValue({ category: '' });
    } else {
      // Selected existing category
      this.showCustomCategoryInput = false;
      this.subscriptionForm.patchValue({ category: value });
    }
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
          // Reload categories to include any newly created ones
          this.loadCategories();
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

  loadCategories(): void {
    this.subscriptionService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded:', categories);
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
}
