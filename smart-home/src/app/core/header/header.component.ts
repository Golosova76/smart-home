import {Component, EventEmitter, Output} from '@angular/core';

import {SvgIconComponent} from '@/app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-header',
  imports: [
    SvgIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleHeader = new EventEmitter<void>();

  onToggleClick() {
    this.toggleHeader.emit();
  }

}
