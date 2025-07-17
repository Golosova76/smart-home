import { Component } from '@angular/core';

import { DashboardComponent } from '@/app/core/dashboard/dashboard.component';
import { SidebarComponent } from '@/app/core/sidebar/sidebar.component';

@Component({
  imports: [SidebarComponent, DashboardComponent],
  selector: 'app-navigation',
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {}
