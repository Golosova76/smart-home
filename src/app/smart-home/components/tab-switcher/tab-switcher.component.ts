import type { InputSignal, OutputEmitterRef } from "@angular/core";
import { Component, input, output } from "@angular/core";

import type { Tab } from "@/app/shared/models/data.model";

@Component({
  selector: "app-tab-switcher",
  standalone: true,
  imports: [],
  templateUrl: "./tab-switcher.component.html",
  styleUrl: "./tab-switcher.component.scss",
})
export class TabSwitcherComponent {
  // dashboard
  public readonly deleteClick: OutputEmitterRef<void> = output<void>();
  public readonly editClick: OutputEmitterRef<void> = output<void>();
  public readonly saveClick: OutputEmitterRef<void> = output<void>();
  public readonly discardClick: OutputEmitterRef<void> = output<void>();
  public readonly addTabClick: OutputEmitterRef<void> = output<void>();
  public readonly removeTabClick: OutputEmitterRef<string> = output<string>();

  //tab
  public readonly selectTab: OutputEmitterRef<string> = output<string>();

  public readonly reorderTab = output<{
    tabId: string;
    direction: "left" | "right";
  }>();

  public readonly startTitleEdit: OutputEmitterRef<{
    tabId: string;
    currentTitle: string;
  }> = output<{
    tabId: string;
    currentTitle: string;
  }>();
  public readonly commitTitleEdit: OutputEmitterRef<{
    tabId: string;
    newTitle: string;
  }> = output<{
    tabId: string;
    newTitle: string;
  }>();
  public readonly endTitleEdit: OutputEmitterRef<void> = output<void>();

  public readonly activeTabId: InputSignal<string | null> = input<
    string | null
  >(null);

  public readonly editMode: InputSignal<boolean> = input<boolean>(false);

  public readonly editTabId: InputSignal<string | null> = input<string | null>(
    null,
  );
  public readonly tabTitleDraft: InputSignal<string> = input<string>("");
  public readonly tabs: InputSignal<Tab[]> = input<Tab[]>([]);

  public onTabClick(tabId: string): void {
    this.selectTab.emit(tabId);
  }

  public onDelete(): void {
    if (this.editMode()) return;
    this.deleteClick.emit();
  }

  public onAddTab(): void {
    this.addTabClick.emit();
  }

  public onRemoveTab(tabId: string): void {
    this.removeTabClick.emit(tabId);
  }

  public onEditClick(): void {
    this.editClick.emit();
  }

  public onSave(): void {
    this.saveClick.emit();
  }
  public onDiscard(): void {
    this.discardClick.emit();
  }

  public onReorder(tabId: string, direction: "left" | "right"): void {
    this.reorderTab.emit({ tabId, direction });
  }

  public onStartEdit(tab: Tab): void {
    this.startTitleEdit.emit({ tabId: tab.id, currentTitle: tab.title });
  }

  public onCommitEdit(tabId: string, inputElement: HTMLInputElement): void {
    const newTitle = inputElement.value ?? "";
    this.commitTitleEdit.emit({ tabId, newTitle });
  }

  public onEndEdit(): void {
    this.endTitleEdit.emit();
  }

  public isEditing(tabId: string): boolean {
    return this.editTabId() === tabId;
  }
}
