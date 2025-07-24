import { Component, EventEmitter, Output } from '@angular/core';

import { SvgIconComponent } from '@/app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.scss',
})
export class SidebarHeaderComponent {
}
