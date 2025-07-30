import { Component, inject } from '@angular/core';

import { SidebarComponent } from '@/app/core/sidebar/sidebar.component';
import { HeaderComponent } from '@/app/core/header/header.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, AsyncPipe],
  selector: 'app-navigation',
  standalone: true,
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  authService = inject(AuthService);

  isSidebarVisible = window.innerWidth > 1024;

  isAuth$ = this.authService.isAuth$;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
