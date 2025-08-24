import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.scss',
})
export class SidebarMainComponent implements OnInit {
  handlerService = inject(DashboardHandlerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  sidebarCollapsed = input<boolean>(false);

  readonly dashboardsSignal = this.handlerService.dashboardsSignal;

  readonly emptyDashboardText = computed(() => {
    return this.sidebarCollapsed()
      ? 'No dash'
      : 'You don’t have any dashboards yet. They’ll appear here as soon as you create them.';
  });

  readonly dashboardIdRoute: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const id: string | null =
          this.route.firstChild?.snapshot.params['dashboardId'];
        return typeof id === 'string' ? id : null;
      }),
    ),
    { initialValue: null },
  );

  ngOnInit() {
    this.handlerService
      .loadDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboards) => {
          const currentId = this.dashboardIdRoute();

          const hasValidDashboard = dashboards.some(
            (dash) => dash.id === currentId,
          );

          if (dashboards.length > 0 && !hasValidDashboard) {
            this.router
              .navigate(['/dashboard', dashboards[0].id])
              .catch(() => {});
          }
        },
      });
  }
}
