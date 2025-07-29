import { Component } from '@angular/core';

import { SidebarComponent } from '@/app/core/sidebar/sidebar.component';
import { HeaderComponent } from '@/app/core/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
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
