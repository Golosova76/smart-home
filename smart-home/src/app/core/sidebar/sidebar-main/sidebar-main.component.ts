import { Component, inject, OnInit, Signal } from '@angular/core';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { DataModel } from '@/app/shared/models/data.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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
    this.dashboardService.getDashboards().subscribe();
  }

  onDashboard(dashboard: Dashboard) {
    this.dashboardService.getDashboardById(dashboard.id).subscribe({
      next: (data: DataModel) => {
        if (data.tabs && data.tabs.length > 0) {
          const firstTabId = data.tabs[0].id;
          this.router
            .navigate(['/dashboard', dashboard.id, firstTabId])
            .catch(() => {});
        }
      },
    });
  }

  isActive(dashboard: Dashboard) {
    return dashboard.id === this.dashboardIdRoute();
  }
}
