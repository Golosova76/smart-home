import type {
  InputSignal,
  OnInit,
  Signal,
  WritableSignal,
} from "@angular/core";
import { Component, computed, DestroyRef, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";
import { LoaderOverlayComponent } from "@/app/shared/components/loader-overlay/loader-overlay.component";
import { LoadingService } from "@/app/shared/services/loading.service";
import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";

@Component({
  selector: "app-sidebar-main",
  standalone: true,
  imports: [RouterLinkActive, RouterLink, LoaderOverlayComponent],
  templateUrl: "./sidebar-main.component.html",
  styleUrl: "./sidebar-main.component.scss",
})
export class SidebarMainComponent implements OnInit {
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly loading: LoadingService = inject(LoadingService);
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);

  public readonly sidebarCollapsed: InputSignal<boolean> =
    input<boolean>(false);

  public dashboardsSignal: WritableSignal<Dashboard[]> =
    this.handlerService.dashboardsSignal;

  public emptyDashboardText = computed(() => {
    return this.sidebarCollapsed()
      ? "No dash"
      : "You don’t have any dashboards yet. They’ll appear here as soon as you create them.";
  });

  public readonly isDashboardsLoading: WritableSignal<boolean> =
    this.loading.visible("dashboards");

  public readonly selectedDashboardInitialized: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectDashboardInitialized,
    );

  public readonly isDashboardBusy: Signal<boolean> = computed((): boolean => {
    const stillLoadingList: boolean = this.isDashboardsLoading();
    const hasDashboards: boolean = this.dashboardsSignal().length > 0;
    const selectedNotReady: boolean = !this.selectedDashboardInitialized();

    // 1) Пока грузим список — показываем спиннер.
    // 2) Если список пуст — НЕ блокируем пустым экраном из-за selectedNotReady.
    // 3) Если список есть, но выбранный даш ещё не инициализировался — показываем спиннер.
    return stillLoadingList || (hasDashboards && selectedNotReady);
  });

  public ngOnInit(): void {
    this.handlerService
      .loadDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (): void => {
          const currentRouteId: string | null =
            this.routeIds.dashboardIdRouteSignal();
          const currentIdValid: string | null =
            this.routeIds.dashboardIdValid();

          if (
            !isNullOrEmpty(currentIdValid) &&
            currentRouteId !== currentIdValid
          ) {
            this.routeIds.selectDashboard(currentIdValid);
          }
        },
      });
  }
}
