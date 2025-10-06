import { Component, input, output } from '@angular/core';

import { Tab } from '@/app/shared/models/data.model';

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss',
})
export class TabSwitcherComponent {
  // dashboard
  readonly deleteClick = output<void>();
  readonly editClick = output<void>();
  readonly saveClick = output<void>();
  readonly discardClick = output<void>();
  readonly addTabClick = output<void>();
  readonly removeTabClick = output<string>();

  //tab
  readonly selectTab = output<string>();

  readonly reorderTab = output<{
    tabId: string;
    direction: 'left' | 'right';
  }>();

  readonly startTitleEdit = output<{ tabId: string; currentTitle: string }>();
  readonly commitTitleEdit = output<{ tabId: string; newTitle: string }>();
  readonly endTitleEdit = output<void>();

  readonly activeTabId = input<string | null>(null);
  readonly editMode = input<boolean>(false);

  readonly editTabId = input<string | null>(null);
  readonly tabTitleDraft = input<string>('');
  readonly tabs = input<Tab[]>([]);

  onTabClick(tabId: string) {
    this.selectTab.emit(tabId);
  }

  onDelete() {
    if (this.editMode()) return;
    this.deleteClick.emit();
  }

  onAddTab() {
    this.addTabClick.emit();
  }

  onRemoveTab(tabId: string) {
    this.removeTabClick.emit(tabId);
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

  onReorder(tabId: string, direction: 'left' | 'right') {
    this.reorderTab.emit({ tabId, direction });
  }

  onStartEdit(tab: Tab) {
    this.startTitleEdit.emit({ tabId: tab.id, currentTitle: tab.title });
  }

  onCommitEdit(tabId: string, inputElement: HTMLInputElement) {
    const newTitle = inputElement.value ?? '';
    this.commitTitleEdit.emit({ tabId, newTitle });
  }

  onEndEdit() {
    this.endTitleEdit.emit();
  }

  isEditing(tabId: string) {
    return this.editTabId() === tabId;
  }
}
