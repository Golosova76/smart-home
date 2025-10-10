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
  protected readonly deleteClick: OutputEmitterRef<void> = output<void>();
  protected readonly editClick: OutputEmitterRef<void> = output<void>();
  protected readonly saveClick: OutputEmitterRef<void> = output<void>();
  protected readonly discardClick: OutputEmitterRef<void> = output<void>();
  protected readonly addTabClick: OutputEmitterRef<void> = output<void>();
  protected readonly removeTabClick: OutputEmitterRef<string> =
    output<string>();

  //tab
  protected readonly selectTab: OutputEmitterRef<string> = output<string>();

  protected readonly reorderTab = output<{
    tabId: string;
    direction: "left" | "right";
  }>();

  protected readonly startTitleEdit: OutputEmitterRef<{
    tabId: string;
    currentTitle: string;
  }> = output<{
    tabId: string;
    currentTitle: string;
  }>();
  protected readonly commitTitleEdit: OutputEmitterRef<{
    tabId: string;
    newTitle: string;
  }> = output<{
    tabId: string;
    newTitle: string;
  }>();
  protected readonly endTitleEdit: OutputEmitterRef<void> = output<void>();

  protected readonly activeTabId: InputSignal<string | null> = input<
    string | null
  >(null);
  protected readonly editMode: InputSignal<boolean> = input<boolean>(false);

  protected readonly editTabId: InputSignal<string | null> = input<
    string | null
  >(null);
  protected readonly tabTitleDraft: InputSignal<string> = input<string>("");
  protected readonly tabs: InputSignal<Tab[]> = input<Tab[]>([]);

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
