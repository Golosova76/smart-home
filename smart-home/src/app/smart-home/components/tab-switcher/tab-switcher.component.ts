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
  @Output() readonly selectTab = new EventEmitter<string>();
  @Output() readonly deleteClick = new EventEmitter<void>();
  @Output() readonly editClick = new EventEmitter<void>();
  @Output() readonly saveClick = new EventEmitter<void>();
  @Output() readonly discardClick = new EventEmitter<void>();

  readonly activeTabId = input<string | null>(null);
  readonly editMode = input<boolean>(false);

  tabs = input<Tab[]>([]);

  onTabClick(tabId: string) {
    this.selectTab.emit(tabId);
  }

  onDelete() {
    if (this.editMode()) return;
    this.deleteClick.emit();
  }

  onEditClick() {
    this.editClick.emit();
  }

  onSave() {
    this.saveClick.emit();
  }
  onDiscard() {
    this.discardClick.emit();
  }
}
