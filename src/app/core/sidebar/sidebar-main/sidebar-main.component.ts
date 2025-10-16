import type { InputSignal, OnInit, WritableSignal } from "@angular/core";
import {
  signal,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";
import { LoaderOverlayComponent } from "@/app/shared/components/loader-overlay/loader-overlay.component";
import { LoadingService } from "@/app/shared/services/loading.service";

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
  private readonly loading = inject(LoadingService);

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
