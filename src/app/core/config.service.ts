import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ApiConfig {
  endpoints: {
    auth: {
      login: string;
      register: string;
    };
    dashboard: {
      summary: string;
    };
    subscriptions: {
      base: string;
      getAll: string;
      create: string;
      update: string;
      delete: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: ApiConfig | null = null;
  private configLoaded = false;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<void> {
    if (this.configLoaded) {
      return Promise.resolve();
    }

    return this.http.get<ApiConfig>('/assets/config.json')
      .toPromise()
      .then(config => {
        if (config) {
          this.config = config;
          this.configLoaded = true;
        }
      })
      .catch(error => {
        console.error('Error loading config:', error);
        throw error;
      });
  }

  getApiUrl(): string {
    return environment.apiUrl;
  }

  getEndpoint(category: keyof ApiConfig['endpoints'], key: string): string {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    const categoryConfig = this.config.endpoints[category] as any;
    return `${environment.apiUrl}${categoryConfig[key]}`;
  }

  get endpoints(): ApiConfig['endpoints'] | null {
    return this.config?.endpoints || null;
  }
}
