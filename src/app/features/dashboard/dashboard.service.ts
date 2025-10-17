import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary } from './dashboard.model';
import { ConfigService } from '../../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getSummary(): Observable<DashboardSummary> {
    const url = this.configService.getEndpoint('dashboard', 'summary');
    return this.http.get<DashboardSummary>(url);
  }
}
