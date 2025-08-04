import { Component } from '@angular/core';

import { DashboardComponent } from '@/app/core/dashboard/dashboard.component';
import { SidebarComponent } from '@/app/core/sidebar/sidebar.component';
import { HeaderComponent } from '@/app/core/header/header.component';

@Component({
  imports: [SidebarComponent, DashboardComponent, HeaderComponent],
  selector: 'app-navigation',
  standalone: true,
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isSidebarVisible = window.innerWidth > 1024;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
