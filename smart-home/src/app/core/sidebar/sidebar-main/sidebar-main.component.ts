import { Component, DestroyRef, inject, input, Signal } from '@angular/core';
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
export class SidebarMainComponent {
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

  constructor() {
    this.dashboardService
      .getDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboardsSignal) => this.dashboardsSignal.set(dashboardsSignal),
      });
  }

  onDashboard(dashboard: Dashboard) {
    this.router.navigate(['/dashboard', dashboard.id]).catch(() => {});
  }

  isActive(dashboard: Dashboard) {
    return dashboard.id === this.dashboardIdRoute();
  }
}
