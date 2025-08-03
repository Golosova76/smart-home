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
  private lastDashboardId: string | null = null;
  private lastTabId: string | null = null;

  //получение параметров URL - сигналы
  readonly paramMap = toSignal(this.route.paramMap);
  readonly dashboardIdRoute = computed(
    () => this.paramMap()?.get('dashboardId') ?? null,
  );
  readonly tabIdRoute = toSignal(
    this.route.firstChild?.params.pipe(
      map((parameters) => parameters['tabId'] ?? null),
    ) ?? of(null),
    { initialValue: null },
  );

  // сигналы
  //массив dashboards где dashboardId
  readonly dashboards = this.dashboardService.dashboards;
  // один dashboard с tabs
  readonly dashboardById = this.dashboardService.dashboardById;
  // массив tab где tabId
  readonly tabs = this.dashboardService.tabs;

  // получаем TabId кот соот роуту
  readonly selectedTabId = computed(() => {
    const tabs = this.tabs();
    return tabs.find((tab) => tab.id === this.tabIdRoute())?.id ?? null;
  });

  ngOnInit(): void {
    this.initDashboards();
    this.initRouteParams();
  }

  //подгрузка dashboards при необходимости
  private initDashboards() {
    console.log('[initDashboards] SIGNAL dashboards до:', this.dashboards());
    if (this.dashboards.length === 0 || !this.dashboards()) {
      this.dashboardService.getDashboards().subscribe({
        next: (data) => {
          // Это данные из бэка
          console.log(
            '[initDashboards] BACKEND dashboards после запроса:',
            data,
          );

          if (this.lastDashboardId !== null) {
            console.log(
              '[initDashboards] >>> Повторный вызов handleRouteParams после загрузки данных',
            );
            this.handleRouteParams(this.lastDashboardId, this.lastTabId);
          }
        },
      });
    }
  }

  initRouteParams() {
    combineLatest([
      this.route.paramMap, // dashboardId
      this.route.firstChild?.paramMap ?? of(null), // tabId
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([parentParameters, childParameters]) => {
        const dashboardId = parentParameters.get('dashboardId');
        const tabId = childParameters?.get('tabId') ?? null;
        console.log(
          '[initRouteParams] ROUTE dashboardId:',
          dashboardId,
          'tabId:',
          tabId,
        );

        // Запоминаем актуальные параметры роута:
        this.lastDashboardId = dashboardId;
        this.lastTabId = tabId;

        this.handleRouteParams(dashboardId, tabId);
      });
  }

  onTabSelected(tabId: string) {
    this.router
      .navigate(['/dashboard', this.dashboardIdRoute(), tabId])
      .catch(() => {});
  }

  handleRouteParams(dashboardId: string | null, tabId: string | null) {
    const dashboards = this.dashboards();
    console.log('SIGNAL dashboards:', dashboards);

    // Это то, что пришло из роутера — параметры роута
    console.log(
      '[handleRouteParams] ROUTE dashboardId:',
      dashboardId,
      'tabId:',
      tabId,
    );

    const dashboardIdRouteSub = this.getValidDashboardId(
      dashboards,
      dashboardId,
    );
    console.log(
      '[handleRouteParams] SIGNAL dashboardIdRouteSub:',
      dashboardIdRouteSub,
    );
    if (!dashboardIdRouteSub) return;

    console.log(
      '[handleRouteParams] SIGNAL dashboards:',
      dashboards,
      'dashboardIdRouteSub:',
      dashboardIdRouteSub,
      'tabId:',
      tabId,
    );

    let tabIdRouteSub;

    this.dashboardService
      .getDashboardById(dashboardIdRouteSub)
      .subscribe((dataModel) => {
        // === ЭТО ДАННЫЕ ИЗ БЭКА (НЕ СИГНАЛ, А HTTP ОТВЕТ) ===
        console.log(
          '[getDashboardById.subscribe] BACKEND dataModel:',
          dataModel,
        );
        this.dashboardById.set(dataModel);
        this.tabs.set(dataModel.tabs);
        tabIdRouteSub = this.getValidTabId(dataModel.tabs, tabId);
        console.log(
          '[getDashboardById.subscribe] SIGNAL tabIdRouteSub:',
          tabIdRouteSub,
        );

        if (!tabIdRouteSub) return;

        if (dashboardIdRouteSub !== dashboardId || tabIdRouteSub !== tabId) {
          this.router
            .navigate(['/dashboard', dashboardIdRouteSub, tabIdRouteSub])
            .catch(() => {});
          return;
        }
      });
  }

  private getValidDashboardId(
    dashboards: Dashboard[],
    dashboardId: string | null,
  ) {
    const httpDashboardId = dashboards.some(
      (dashboard) => dashboard.id === dashboardId,
    );
    if (!dashboardId || !httpDashboardId) {
      return dashboards.length > 0 ? dashboards[0].id : null;
    }
    return dashboardId;
  }

  private getValidTabId(tabs: Tab[], tabId: string | null) {
    const httpTabId = tabs.some((tab) => tab.id === tabId);
    if (!tabId || !httpTabId) {
      return tabs.length > 0 ? tabs[0].id : null;
    }
    return tabId;
  }
}
