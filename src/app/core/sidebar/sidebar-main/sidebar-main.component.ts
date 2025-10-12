import type { InputSignal, OnInit, WritableSignal } from "@angular/core";
import { Component, computed, DestroyRef, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

@Component({
  selector: "app-sidebar-main",
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: "./sidebar-main.component.html",
  styleUrl: "./sidebar-main.component.scss",
})
export class SidebarMainComponent implements OnInit {
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly sidebarCollapsed: InputSignal<boolean> =
    input<boolean>(false);

  public dashboardsSignal: WritableSignal<Dashboard[]> =
    this.handlerService.dashboardsSignal;

  public emptyDashboardText = computed(() => {
    return this.sidebarCollapsed()
      ? "No dash"
      : "You don’t have any dashboards yet. They’ll appear here as soon as you create them.";
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
