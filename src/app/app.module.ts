import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Chart.js
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';

// Core
import { JwtInterceptor } from './core/jwt.interceptor';
import { ConfigService } from './core/config.service';

// Factory function to load config before app starts
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

// Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SubscriptionListComponent } from './features/subscriptions/subscription-list/subscription-list.component';
import { SubscriptionFormComponent } from './features/subscriptions/subscription-form/subscription-form.component';
import { NotificationsComponent } from './features/notifications/notifications.component';

// Pipes
import { LocalDatePipe } from './shared/local-date.pipe';
import { HighlightPricePipe } from './shared/highlight-price.pipe';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        SubscriptionListComponent,
        SubscriptionFormComponent,
        NotificationsComponent,
        LocalDatePipe,
        HighlightPricePipe
    ],
    bootstrap: [AppComponent], imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        BaseChartDirective
    ], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideCharts(withDefaultRegisterables())
    ] })
export class AppModule { }
