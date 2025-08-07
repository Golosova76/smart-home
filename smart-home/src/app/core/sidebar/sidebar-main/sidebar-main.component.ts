import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.scss',
})
export class SidebarMainComponent implements OnInit {
  dashboardService = inject(DashboardService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  sidebarCollapsed = input<boolean>(false);

  readonly dashboardsSignal = this.dashboardService.dashboardsSignal;

  readonly dashboardIdRoute: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const id = this.route.firstChild?.snapshot.params['dashboardId'];
        return typeof id === 'string' ? id : null;
      }),
    ),
    { initialValue: null },
  );

  ngOnInit() {
    this.dashboardService
      .getDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboards) => {
          this.dashboardsSignal.set(dashboards);

          const dashboardId =
            this.route.firstChild?.snapshot.params['dashboardId'] ?? null;
          const hasValidDashboard = dashboards.some(
            (dash) => dash.id === dashboardId,
          );

          if (dashboards.length > 0 && !hasValidDashboard) {
            this.router
              .navigate(['/dashboard', dashboards[0].id])
              .catch(() => {});
          }
        },
      });
  }

  onDashboard(dashboard: Dashboard) {
    this.router.navigate(['/dashboard', dashboard.id]).catch(() => {});
  }

  isActive(dashboard: Dashboard) {
    return dashboard.id === this.dashboardIdRoute();
  }

  get emptyDashboardText(): string {
    return this.sidebarCollapsed()
      ? 'No dash'
      : 'You don’t have any dashboards yet. They’ll appear here as soon as you create them.';
  }
}
