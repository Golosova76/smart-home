import type { Signal, WritableSignal } from "@angular/core";
import { computed, inject, Injectable } from "@angular/core";
import type { ActivatedRoute } from "@angular/router";
import { NavigationEnd, Router } from "@angular/router";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import type { Tab } from "@/app/shared/models/data.model";
import { Store } from "@ngrx/store";
import { selectTabs } from "@/app/store/selectors/selected-dashboard.selectors";
import type { AppState } from "@/app/store/state/app.state";
import {
  isNonEmptyString,
  isNonNull,
  isNullOrEmpty,
} from "@/app/shared/utils/is-null-or-empty";

@Injectable({
  providedIn: "root",
})
export class RouteIdValidService {
  private readonly router: Router = inject(Router);
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);

  public readonly dashboardsSignal: WritableSignal<Dashboard[]> =
    this.handlerService.dashboardsSignal;
  public readonly tabsSignal: Signal<Tab[]> =
    this.store.selectSignal(selectTabs);

  //получение параметров URL - сигналы
  public readonly dashboardIdRouteSignal: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map((): string | null => this.readParamFromTree("dashboardId")),
    ),
    { initialValue: null },
  );

  public readonly tabIdRouteSignal: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map((): string | null => this.readParamFromTree("tabId")),
    ),
    { initialValue: null },
  );

  public readonly dashboardIdValid: Signal<string | null> = computed(
    (): string | null =>
      this.getValidDashboardId(
        this.dashboardsSignal(),
        this.dashboardIdRouteSignal(),
      ),
  );

  public readonly tabIdValid: Signal<string | null> = computed(
    (): string | null =>
      this.getValidTabId(this.tabsSignal(), this.tabIdRouteSignal()),
  );
  public readonly selectedTabId: Signal<string | null> = this.tabIdValid;

  private readParamFromTree(parameters: string): string | null {
    let route: ActivatedRoute | null = this.router.routerState.root;
    let found: string | null = null;

    while (isNonNull(route)) {
      const value: string | null = route.snapshot.paramMap.get(parameters);
      if (isNonEmptyString(value)) found = value;
      route = route.firstChild ?? null;
    }
    return found;
  }

  public selectDashboard(dashboardId: string | null): void {
    const dashboardIdValid: string | null = this.getValidDashboardId(
      this.dashboardsSignal(),
      dashboardId,
    );
    if (isNullOrEmpty(dashboardIdValid)) return;

    if (this.dashboardIdRouteSignal() === dashboardIdValid) return;

    this.router.navigate(["/dashboard", dashboardIdValid]).catch(() => {});
  }

  public selectTab(tabId: string): void {
    const dashboardIdValid: string | null = this.dashboardIdValid();
    const tabIdValid: string | null = this.getValidTabId(
      this.tabsSignal(),
      tabId,
    );
    if (isNullOrEmpty(dashboardIdValid) || isNullOrEmpty(tabIdValid)) return;

    const dashboardIdRouteSignal: string | null = this.dashboardIdRouteSignal();
    const tabIdRouteSignal: string | null = this.tabIdRouteSignal();

    if (
      dashboardIdValid === dashboardIdRouteSignal &&
      tabIdValid === tabIdRouteSignal
    ) {
      return;
    }
    this.router
      .navigate(["/dashboard", dashboardIdValid, tabIdValid])
      .catch((): void => {});
  }

  public getValidDashboardId(
    dashboards: Dashboard[],
    dashboardIdRoute: string | null,
  ): string | null {
    const hasDashboardId: boolean = dashboards.some(
      (dashboard: Dashboard): boolean => dashboard.id === dashboardIdRoute,
    );
    if (isNullOrEmpty(dashboardIdRoute) || !hasDashboardId) {
      return dashboards.length > 0 ? dashboards[0].id : null;
    }
    return dashboardIdRoute;
  }

  public getValidTabId(tabs: Tab[], tabIdRoute: string | null): string | null {
    const httpTabId: boolean = tabs.some(
      (tab: Tab): boolean => tab.id === tabIdRoute,
    );
    if (isNullOrEmpty(tabIdRoute) || !httpTabId) {
      return tabs.length > 0 ? tabs[0].id : null;
    }
    return tabIdRoute;
  }
}
