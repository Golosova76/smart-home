import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.scss',
})
export class SidebarMainComponent implements OnInit {
  handlerService = inject(DashboardHandlerService);
  routeIds = inject(RouteIdValidService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  sidebarCollapsed = input<boolean>(false);

  readonly dashboardsSignal = this.handlerService.dashboardsSignal;

  readonly emptyDashboardText = computed(() => {
    return this.sidebarCollapsed()
      ? 'No dash'
      : 'You don’t have any dashboards yet. They’ll appear here as soon as you create them.';
  });

  ngOnInit() {
    this.handlerService
      .loadDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const currentRouteId = this.routeIds.dashboardIdRouteSignal();
          const currentIdValid = this.routeIds.dashboardIdValid();

          if (currentIdValid && currentRouteId !== currentIdValid) {
            this.routeIds.selectDashboard(currentIdValid);
          }
        },
      });
  }
}
