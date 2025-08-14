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
  @Output() readonly  selectTab = new EventEmitter<string>();
  @Output() readonly  deleteClick = new EventEmitter<string>();

  activeTabId = input<string | null>(null);

  tabs = input<Tab[]>([]);

  onTabClick(tabId: string) {
    this.selectTab.emit(tabId);
  }

  onDelete() {
    this.deleteClick.emit();
  }
}
