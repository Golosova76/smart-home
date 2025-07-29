import { Routes } from '@angular/router';
import { LoginPageComponent } from '@/app/core/auth/login-page/login-page.component';
import { NotFoundPageComponent } from '@/app/core/not-found-page/not-found-page.component';
import { NavigationComponent } from '@/app/core/navigation/navigation.component';

import { DashboardComponent } from '@/app/core/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    //canActivate: [AuthGuard],
    children: [
      { path: 'dashboard/:dashboardId/:tabId', component: DashboardComponent },
    ],
  },
  { path: 'login', component: LoginPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
