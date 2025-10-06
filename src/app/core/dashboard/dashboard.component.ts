import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ModalConfirmDeleteComponent } from '@/app/smart-home/components/modal/modal-confirm-delete/modal-confirm-delete.component';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import { Store } from '@ngrx/store';

import * as dashboardsSelectors from '@/app/store/selectors/selected-dashboard.selectors';
import * as dashboardActions from '@/app/store/actions/dashboard.actions';
import { AppState } from '@/app/store/state/app.state';
import { Tab } from '@/app/shared/models/data.model';
import { ModalCreateTabsComponent } from '@/app/smart-home/components/modal/modal-create-tabs/modal-create-tabs.component';

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
  readonly tabsSignal = this.store.selectSignal<Tab[]>(dashboardsSelectors.selectTabs);
  readonly editTabId = this.store.selectSignal<string | null>(
    dashboardsSelectors.selectEditTabId,
  );
  readonly tabTitleDraft = this.store.selectSignal<string>(
    dashboardsSelectors.selectTabTitleDraft,
  );

  readonly dashboardIdRouteSignal = this.routeIds.dashboardIdValid;

  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly isAddTabOpenModal = signal<boolean>(false);

  readonly isDeleteOpenModal = signal<boolean>(false);
  readonly isDeleteTabOpenModal = signal<boolean>(false);
  readonly tabToDeleteId = signal<string | null>(null);

  readonly isEditMode = this.store.selectSignal<boolean>(
    dashboardsSelectors.selectIsEditModeEnabled,
  );

  readonly tabToDeleteName = computed(() => {
    const tabId = this.tabToDeleteId();
    if (!tabId) return '';

    const tab = this.tabsSignal().find((tab) => tab.id === tabId);
    return tab?.title || '';
  });

  onTabSelected(tabId: string) {
    this.routeIds.selectTab(tabId);
  }

  constructor() {
    effect(() => {
      const dashboardId = this.routeIds.dashboardIdValid();
      if (dashboardId) {
        this.store.dispatch(dashboardActions.selectDashboard({ dashboardId }));
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
    this.store.dispatch(dashboardActions.TabActionsTitleMove.addTab({ title }));
    this.closeDelete();
  }

  closeDelete() {
    this.isDeleteOpenModal.set(false);
    this.isAddTabOpenModal.set(false);
    this.isDeleteTabOpenModal.set(false);
    this.tabToDeleteId.set(null);
  }

  onRemoveTab(): void {
    const id = this.tabToDeleteId();
    if (!id) return;
    this.store.dispatch(dashboardActions.TabActionsTitleMove.removeTab({ tabId: id }));
    this.closeDelete();
    this.tabToDeleteId.set(null);
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
    this.store.dispatch(dashboardActions.enterEditMode());
  }

  onSave() {
    this.store.dispatch(dashboardActions.saveDashboard());
    this.store.dispatch(dashboardActions.exitEditMode());
  }

  onDiscard() {
    this.store.dispatch(dashboardActions.discardChanges());
    this.store.dispatch(dashboardActions.exitEditMode());
  }

  onStartTitleEdit(event: { tabId: string; currentTitle: string }) {
    this.store.dispatch(dashboardActions.TabActionsTitleMove.startTitleEdit(event));
  }

  onEndTitleEdit() {
    this.store.dispatch(dashboardActions.TabActionsTitleMove.endTitleEdit());
  }

  onCommitTitleEdit(event: { tabId: string; newTitle: string }) {
    this.store.dispatch(dashboardActions.TabActionsTitleMove.commitTitleEdit(event));
  }

  onReorderTab(event: { tabId: string; direction: 'left' | 'right' }) {
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.reorderTab({
        tabId: event.tabId,
        direction: event.direction,
      }),
    );
  }

  openRemoveTabModal(tabId: string) {
    if (!this.isEditMode()) {
      return;
    }
    this.tabToDeleteId.set(tabId);
    this.isDeleteTabOpenModal.set(true);
  }
}
