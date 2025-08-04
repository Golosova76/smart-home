import { Component, HostBinding, signal } from '@angular/core';

import { SidebarFooterComponent } from '@/app/core/sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarHeaderComponent } from '@/app/core/sidebar/sidebar-header/sidebar-header.component';
import { SidebarMainComponent } from '@/app/core/sidebar/sidebar-main/sidebar-main.component';

@Component({
  imports: [
    SidebarHeaderComponent,
    SidebarMainComponent,
    SidebarFooterComponent,
  ],
  selector: 'app-sidebar',
  standalone: true,
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  sidebarCollapsed = signal<boolean>(false);

  @HostBinding('class.collapsed')
  get isCollapsed() {
    return this.sidebarCollapsed();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((visible) => !visible);
  }
}
