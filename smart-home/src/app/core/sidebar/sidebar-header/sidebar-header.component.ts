import {Component, input, output} from '@angular/core';

import { SvgIconComponent } from '@/app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.scss',
})
export class SidebarHeaderComponent {
  sidebarCollapsed = input<boolean>(false);
  menuClicked = output<void>();
}
