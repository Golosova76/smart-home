import { Component } from '@angular/core';

import { DashboardComponent } from '@/app/core/dashboard/dashboard.component';
import { SidebarComponent } from '@/app/core/sidebar/sidebar.component';

@Component({
  imports: [SidebarComponent, DashboardComponent],
  selector: 'app-navigation',
  standalone: true,
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isSidebarVisible = true;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

}
