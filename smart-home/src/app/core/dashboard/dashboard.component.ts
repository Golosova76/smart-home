import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  Signal,
} from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { Tab } from '@/app/shared/models/data.model';
import { filter, map, startWith, switchMap } from 'rxjs';
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
  route = inject(ActivatedRoute);
  router = inject(Router);
  dashboardService = inject(DashboardService);
  destroyRef = inject(DestroyRef);
  handlerService = inject(DashboardHandlerService);
  routeIds = inject(RouteIdValidService);

  //массив dashboards где dashboardId
  readonly dashboardsSignal = this.handlerService.dashboardsSignal;
  // один dashboard с tabs
  readonly dashboardByIdSignal = this.handlerService.dashboardByIdSignal;
  // массив tab где tabId
  readonly tabsSignal = this.handlerService.tabsSignal;

  readonly isDeleteOpenModal = signal<boolean>(false);
  readonly isEditMode = signal<boolean>(false);

  // получаем TabId кот соот роуту
  readonly selectedTabId = this.routeIds.selectedTabId;

  onTabSelected(tabId: string) {
    this.routeIds.selectTab(tabId);
  }

  constructor() {
    effect(() => {
      const dashboardId = this.routeIds.dashboardIdRouteSignal();
      if (dashboardId) {
        this.initTabs(dashboardId);
      }
    });
  }

  private initTabs(dashboardId: string) {
    if (!dashboardId) return;

    this.dashboardService
      .getDashboardById(dashboardId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dataModel) => {
          this.dashboardByIdSignal.set(dataModel);
          this.tabsSignal.set(dataModel.tabs);
          this.handleRouteParams(
            this.dashboardIdRouteSignal(),
            this.tabIdRouteSignal(),
          );
        },
        error: (error) => {
          console.error('Ошибка загрузки Dashboard:', error);
        },
      });
  }

  handleRouteParams(
    dashboardIdRoute: string | null,
    tabIdRoute: string | null,
  ) {
    const dashboardsSignal = this.dashboardsSignal();

    const dashboardIdValid = this.getValidDashboardId(
      dashboardsSignal,
      dashboardIdRoute,
    );

    if (!dashboardIdValid) return;

    const tabIdValid = this.getValidTabId(this.tabsSignal(), tabIdRoute);

    if (!tabIdValid) return;

    if (dashboardIdValid !== dashboardIdRoute || tabIdValid !== tabIdRoute) {
      this.router
        .navigate(['/dashboard', dashboardIdValid, tabIdValid])
        .catch(() => {});
      return;
    }
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
    const dashboardId = this.dashboardIdRouteSignal();
    if (!dashboardId) {
      this.closeDelete();
      return;
    }

    this.handlerService
      .removeDashboard(dashboardId)
      .pipe(
        switchMap(() => this.handlerService.loadDashboards()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (nextId) => {
          this.closeDelete();
          this.router
            .navigate(nextId ? ['/dashboard', nextId] : ['/dashboard'])
            .catch(() => {});
        },
      });
  }

  onEditClick() {
    this.isEditMode.update((v) => !v);
  }

  //конец класса
}
