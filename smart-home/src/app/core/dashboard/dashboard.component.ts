import { Component, DestroyRef, effect, inject, signal } from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ModalConfirmDeleteComponent } from '@/app/smart-home/components/modal/modal-confirm-delete/modal-confirm-delete.component';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';

@Component({
  imports: [TabSwitcherComponent, RouterOutlet, ModalConfirmDeleteComponent],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  handlerService = inject(DashboardHandlerService);
  routeIds = inject(RouteIdValidService);

  // массив tab где tabId
  readonly tabsSignal = this.handlerService.tabsSignal;

  readonly dashboardIdRouteSignal = this.routeIds.dashboardIdValid;

  readonly isDeleteOpenModal = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);

  readonly selectedTabId = this.routeIds.selectedTabId;

  onTabSelected(tabId: string) {
    this.routeIds.selectTab(tabId);
  }

  constructor() {
    effect(() => {
      const dashboardId = this.routeIds.dashboardIdValid();
      if (dashboardId) {
        this.initTabs(dashboardId);
      }
    });
  }

  private initTabs(dashboardId: string) {
    if (!dashboardId) return;

    this.handlerService
      .loadDashboardById(dashboardId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const tabIdValid = this.routeIds.tabIdValid();
          if (tabIdValid) {
            this.routeIds.selectTab(tabIdValid);
          }
        },
        error: (error) => {
          console.error('Ошибка загрузки Dashboard:', error);
        },
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
