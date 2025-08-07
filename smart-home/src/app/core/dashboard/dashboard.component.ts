import { Component, computed, DestroyRef, effect, inject } from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { Tab } from '@/app/shared/models/data.model';
import { map, of } from 'rxjs';

@Component({
  imports: [TabSwitcherComponent, RouterOutlet],
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

  //получение параметров URL - сигналы
  readonly dashboardIdRouteSignal = toSignal(
    this.route.paramMap.pipe(
      map((parameters) => parameters.get('dashboardId') ?? null),
    ),
    { initialValue: null },
  );
  readonly tabIdRouteSignal = toSignal(
    this.route.firstChild?.paramMap.pipe(
      map((parameters) => parameters.get('tabId')),
    ) ?? of(null),
    { initialValue: null },
  );

  //массив dashboards где dashboardId
  readonly dashboardsSignal = this.dashboardService.dashboardsSignal;
  // один dashboard с tabs
  readonly dashboardByIdSignal = this.dashboardService.dashboardByIdSignal;
  // массив tab где tabId
  readonly tabsSignal = this.dashboardService.tabsSignal;

  // получаем TabId кот соот роуту
  readonly selectedTabId = computed(() => {
    return this.getValidTabId(this.tabsSignal(), this.tabIdRouteSignal());
  });

  onTabSelected(tabId: string) {
    this.router
      .navigate(['/dashboard', this.dashboardIdRouteSignal(), tabId])
      .catch(() => {});
  }

  constructor() {
    effect(() => {
      const dashboardId = this.dashboardIdRouteSignal();
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

  private getValidDashboardId(
    dashboards: Dashboard[],
    dashboardIdRoute: string | null,
  ) {
    const httpDashboardId = dashboards.some(
      (dashboard) => dashboard.id === dashboardIdRoute,
    );
    if (!dashboardIdRoute || !httpDashboardId) {
      return dashboards.length > 0 ? dashboards[0].id : null;
    }
    return dashboardIdRoute;
  }

  private getValidTabId(tabs: Tab[], tabIdRoute: string | null) {
    const httpTabId = tabs.some((tab) => tab.id === tabIdRoute);
    if (!tabIdRoute || !httpTabId) {
      return tabs.length > 0 ? tabs[0].id : null;
    }
    return tabIdRoute;
  }

  //конец класса
}
