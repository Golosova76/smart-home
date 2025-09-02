import { Component, DestroyRef, effect, inject, signal } from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ModalConfirmDeleteComponent } from '@/app/smart-home/components/modal/modal-confirm-delete/modal-confirm-delete.component';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import { Store } from '@ngrx/store';

import * as SD from '@/app/store/selectors/selected-dashboard.selectors';
import * as A from '@/app/store/actions/dashboard.actions';
import { AppState } from '@/app/store/state/app.state';
import { Tab } from '@/app/shared/models/data.model';
import {
  ModalCreateTabsComponent
} from '@/app/smart-home/components/modal/modal-create-tabs/modal-create-tabs.component';

@Component({
  imports: [
    TabSwitcherComponent,
    RouterOutlet,
    ModalConfirmDeleteComponent,
    ModalCreateTabsComponent,
  ],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly handlerService = inject(DashboardHandlerService);
  private readonly routeIds = inject(RouteIdValidService);
  private store = inject<Store<AppState>>(Store);

  // массив tab где tabId
  readonly tabsSignal = this.store.selectSignal<Tab[]>(SD.selectTabs);
  readonly editTabId = this.store.selectSignal<string | null>(
    SD.selectEditTabId,
  );
  readonly tabTitleDraft = this.store.selectSignal<string>(
    SD.selectTabTitleDraft,
  );

  readonly dashboardIdRouteSignal = this.routeIds.dashboardIdValid;
  readonly dashboardIdTabSignal = this.routeIds.tabIdValid;
  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly isAddTabOpenModal = signal<boolean>(false);

  readonly isDeleteOpenModal = signal<boolean>(false);
  readonly isDeleteTabOpenModal = signal<boolean>(false);

  readonly isEditMode = this.store.selectSignal<boolean>(
    SD.selectIsEditModeEnabled,
  );

  // readonly workingCopy = this.store.selectSignal(SD.selectWorkingCopy)

  onTabSelected(tabId: string) {
    this.routeIds.selectTab(tabId);
  }

  constructor() {
    effect(() => {
      const dashboardId = this.routeIds.dashboardIdValid();
      if (dashboardId) {
        this.store.dispatch(A.selectDashboard({ dashboardId }));
      }
    });
  }

  openDeleteModal() {
    if (this.isEditMode()) {
      return;
    }
    this.isDeleteOpenModal.set(true);
  }

  openAddTabModal() {
    if (!this.isEditMode()) {
      return;
    }
    this.isAddTabOpenModal.set(true);
  }

  onAddTabSubmit(title: string): void {
    this.store.dispatch(A.TabActionsTitleMove.addTab({ title }));
    this.closeDelete();
  }

  closeDelete() {
    this.isDeleteOpenModal.set(false);
    this.isAddTabOpenModal.set(false);
    this.isDeleteTabOpenModal.set(false);
  }

  onRemoveTab(): void {
    const id = this.dashboardIdTabSignal();
    if (!id) return;
    this.store.dispatch(A.TabActionsTitleMove.removeTab({ tabId: id }));
    this.closeDelete();
  }

  onDelete() {
    const dashboardId = this.routeIds.dashboardIdRouteSignal();
    if (!dashboardId) {
      this.closeDelete();
      return;
    }

    this.handlerService
      .removeDashboard(dashboardId)
      .pipe(
        switchMap((nextIdAfterRemove) =>
          this.handlerService.loadDashboards().pipe(
            map(() => {
              const firstId =
                this.handlerService.dashboardsSignal()[0]?.id ?? null;
              return nextIdAfterRemove ?? firstId ?? null;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (nextId) => {
          this.closeDelete();
          if (nextId) {
            this.routeIds.selectDashboard(nextId);
          }
        },
      });
  }

  onEditClick() {
    this.store.dispatch(A.enterEditMode());
  }

  onSave() {
    this.store.dispatch(A.saveDashboard());
    this.store.dispatch(A.exitEditMode());
  }

  onDiscard() {
    this.store.dispatch(A.discardChanges());
    this.store.dispatch(A.exitEditMode());
  }

  onStartTitleEdit(event: { tabId: string; currentTitle: string }) {
    this.store.dispatch(A.TabActionsTitleMove.startTitleEdit(event));
  }

  onEndTitleEdit() {
    this.store.dispatch(A.TabActionsTitleMove.endTitleEdit());
  }

  onCommitTitleEdit(event: { tabId: string; newTitle: string }) {
    this.store.dispatch(A.TabActionsTitleMove.commitTitleEdit(event));
  }

  onReorderTab(event: { tabId: string; direction: 'left' | 'right' }) {
    this.store.dispatch(
      A.TabActionsTitleMove.reorderTab({
        tabId: event.tabId,
        direction: event.direction,
      }),
    );
  }

  openRemoveTabModal() {
    if (!this.isEditMode()) {
      return;
    }
    this.isDeleteTabOpenModal.set(true);
  }
}
