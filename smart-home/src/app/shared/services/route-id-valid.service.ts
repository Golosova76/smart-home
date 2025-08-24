import { computed, inject, Injectable, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { Tab } from '@/app/shared/models/data.model';

@Injectable({
  providedIn: 'root',
})
export class RouteIdValidService {
  route = inject(ActivatedRoute);
  router = inject(Router);
  handlerService = inject(DashboardHandlerService);

  readonly dashboardsSignal = this.handlerService.dashboardsSignal;
  readonly dashboardByIdSignal = this.handlerService.dashboardByIdSignal;
  readonly tabsSignal = this.handlerService.tabsSignal;

  //получение параметров URL - сигналы
  readonly dashboardIdRouteSignal: Signal<string | null> = toSignal(
    this.route.paramMap.pipe(
      map((parameters) => parameters.get('dashboardId') ?? null),
    ),
    { initialValue: null },
  );

  readonly tabIdRouteSignal: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot.paramMap.get('tabId') ?? null),
    ),
    { initialValue: null },
  );

  readonly dashboardIdValid = computed(() => this.getValidDashboardId(this.dashboardsSignal(), this.dashboardIdRouteSignal()));

  readonly tabIdValid = computed(() => this.getValidTabId(this.tabsSignal(), this.tabIdRouteSignal()));

  readonly selectedTabId = computed(() => {
    return this.getValidTabId(this.tabsSignal(), this.tabIdRouteSignal());
  });

  selectTab(tabId: string) {
    const dashboardIdValid = this.dashboardIdValid();
    const tabIdValid = this.getValidTabId(this.tabsSignal(), tabId);
    if (!dashboardIdValid || !tabIdValid) return;

    this.router.navigate(['/dashboard', dashboardIdValid, tabIdValid]).catch(() => {});
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
