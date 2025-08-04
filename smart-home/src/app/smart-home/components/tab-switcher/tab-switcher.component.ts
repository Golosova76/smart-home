import { Component, EventEmitter, input, Output } from '@angular/core';

import { Tab } from '@/app/shared/models/data.model';

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss',
})
export class TabSwitcherComponent {
  @Output() selectTab = new EventEmitter<string>();
  activeTabId = input<string>('');

  tabs = input<Tab[]>([]);

  onTabClick(tabId: string) {
    this.selectTab.emit(tabId);
  }
}
