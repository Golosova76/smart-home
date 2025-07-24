import { Component, HostBinding, input } from '@angular/core';

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
  opened = input<boolean>(true);

  @HostBinding('class.closed')
  get isCosed() {
    return !this.opened();
  }
}
