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

@Component({
  imports: [TabSwitcherComponent, RouterOutlet, ModalConfirmDeleteComponent],
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
  readonly tabsSignal = this.store.selectSignal(SD.selectTabs);

  readonly dashboardIdRouteSignal = this.routeIds.dashboardIdValid;

  readonly isDeleteOpenModal = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);

  readonly selectedTabId = this.routeIds.selectedTabId;

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

  closeDelete() {
    this.isDeleteOpenModal.set(false);
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
    this.isEditMode.update((v) => !v);
  }
}
