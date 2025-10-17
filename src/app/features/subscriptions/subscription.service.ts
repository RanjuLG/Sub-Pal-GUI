import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from './subscription.model';
import { ConfigService } from '../../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getSubscriptions(): Observable<Subscription[]> {
    const url = this.configService.getEndpoint('subscriptions', 'getAll');
    return this.http.get<Subscription[]>(url);
  }

  addSubscription(subscription: Subscription): Observable<Subscription> {
    const url = this.configService.getEndpoint('subscriptions', 'create');
    return this.http.post<Subscription>(url, subscription);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    const baseUrl = this.configService.getEndpoint('subscriptions', 'update');
    return this.http.put<Subscription>(`${baseUrl}/${subscription.id}`, subscription);
  }

  deleteSubscription(id: string): Observable<any> {
    const baseUrl = this.configService.getEndpoint('subscriptions', 'delete');
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
