import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { Tab } from '@/app/shared/models/data.model';
import { combineLatest, map, of } from 'rxjs';

@Component({
  imports: [TabSwitcherComponent, RouterOutlet],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  dashboardService = inject(DashboardService);
  destroyRef = inject(DestroyRef);

  // Добавляем новые поля для хранения последних параметров роута:
  private lastDashboardIdRoute: string | null = null;
  private lastTabIdRoute: string | null = null;

  //получение параметров URL - сигналы
  readonly dashboardIdRouteSignal = toSignal(
    this.route.paramMap.pipe(
      map((parameters) => parameters.get('dashboardId') ?? null),
    ),
    { initialValue: null },
  );
  readonly tabIdRouteSignal = toSignal(
    this.route.firstChild?.params.pipe(
      map((parameters) => parameters['tabId'] ?? null),
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
    const tabsSignal = this.tabsSignal();
    return (
      tabsSignal.find((tab) => tab.id === this.tabIdRouteSignal())?.id ?? null
    );
  });

  ngOnInit(): void {
    this.initDashboards();
    this.initRouteParams();
  }

  initRouteParams() {
    combineLatest([
      this.route.paramMap, // dashboardId
      this.route.firstChild?.paramMap ?? of(null), // tabId
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([parentParameters, childParameters]) => {
        const dashboardIdRoute = parentParameters.get('dashboardId');
        const tabIdRoute = childParameters?.get('tabId') ?? null;
        console.log(
          '[initRouteParams] ROUTE dashboardId:',
          dashboardIdRoute,
          'tabId:',
          tabIdRoute,
        );

        // Запоминаем актуальные параметры роута:
        this.lastDashboardIdRoute = dashboardIdRoute;
        this.lastTabIdRoute = tabIdRoute;

        this.handleRouteParams(dashboardIdRoute, tabIdRoute);
      });
  }

  onTabSelected(tabId: string) {
    this.router
      .navigate(['/dashboard', this.dashboardIdRouteSignal(), tabId])
      .catch(() => {});
  }

  handleRouteParams(
    dashboardIdRoute: string | null,
    tabIdRoute: string | null,
  ) {
    const dashboardsSignal = this.dashboardsSignal();
    console.log('SIGNAL dashboards:', dashboardsSignal);

    // Это то, что пришло из роутера — параметры роута
    console.log(
      '[handleRouteParams] ROUTE dashboardId:',
      dashboardIdRoute,
      'tabId:',
      tabIdRoute,
    );

    const dashboardIdValid = this.getValidDashboardId(
      dashboardsSignal,
      dashboardIdRoute,
    );
    console.log(
      '[handleRouteParams] SIGNAL dashboardIdRouteSub:',
      dashboardIdValid,
    );
    if (!dashboardIdValid) return;

    console.log(
      '[handleRouteParams] SIGNAL dashboards:',
      dashboardsSignal,
      'dashboardIdRouteSub:',
      dashboardIdValid,
      'tabId:',
      tabIdRoute,
    );

    let tabIdValid;

    this.dashboardService
      .getDashboardById(dashboardIdValid)
      .subscribe((dataModel) => {
        console.log(
          '[getDashboardById.subscribe] BACKEND dataModel:',
          dataModel,
        );
        this.dashboardByIdSignal.set(dataModel);
        this.tabsSignal.set(dataModel.tabs);
        tabIdValid = this.getValidTabId(dataModel.tabs, tabIdRoute);
        console.log(
          '[getDashboardById.subscribe] SIGNAL tabIdRouteSub:',
          tabIdValid,
        );

        if (!tabIdValid) return;

        if (
          dashboardIdValid !== dashboardIdRoute ||
          tabIdValid !== tabIdRoute
        ) {
          this.router
            .navigate(['/dashboard', dashboardIdValid, tabIdValid])
            .catch(() => {});
          return;
        }
      });
  }

  private initDashboards() {
    console.log(
      '[initDashboards] SIGNAL dashboards до:',
      this.dashboardsSignal(),
    );
    if (this.dashboardsSignal.length === 0 || !this.dashboardsSignal()) {
      this.dashboardService.getDashboards().subscribe({
        next: (data) => {
          // Это данные из бэка
          console.log(
            '[initDashboards] BACKEND dashboards после запроса:',
            data,
          );

          if (this.lastDashboardIdRoute !== null) {
            console.log(
              '[initDashboards] >>> Повторный вызов handleRouteParams после загрузки данных',
            );
            this.handleRouteParams(
              this.lastDashboardIdRoute,
              this.lastTabIdRoute,
            );
          }
        },
      });
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
}
