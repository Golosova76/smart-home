import { Component } from '@angular/core';
import { SvgIconComponent } from '@/app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.scss',
})
export class SidebarMainComponent {}
