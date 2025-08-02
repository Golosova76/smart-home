import { Routes } from '@angular/router';
import { LoginPageComponent } from '@/app/core/auth/login-page/login-page.component';
import { NotFoundPageComponent } from '@/app/core/not-found-page/not-found-page.component';
import { NavigationComponent } from '@/app/core/navigation/navigation.component';

import { DashboardComponent } from '@/app/core/dashboard/dashboard.component';
import { authGuard } from '@/app/core/auth/auth.guard';
import { StubComponent } from '@/app/smart-home/components/stub/stub.component';
import { DashboardTabComponent } from '@/app/smart-home/components/dashboard-tab/dashboard-tab.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'stub',
        pathMatch: 'full',
      },
      {
        path: 'stub',
        component: StubComponent,
      },
      {
        path: 'dashboard/:dashboardId',
        component: DashboardComponent,
        children: [
          {
            path: ':tabId',
            component: DashboardTabComponent,
          },
        ],
      },
    ],
  },
  { path: 'login', component: LoginPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
