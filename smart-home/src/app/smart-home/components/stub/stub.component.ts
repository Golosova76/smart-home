import {Component, DestroyRef, inject} from '@angular/core';
import {DashboardService} from '@/app/shared/services/dashboard.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-stub',
  imports: [],
  templateUrl: './stub.component.html',
  styleUrl: './stub.component.scss',
})
export class StubComponent {
  dashboardService = inject(DashboardService);
  destroyRef = inject(DestroyRef);

  readonly dashboards = this.dashboardService.dashboardsSignal;

  constructor() {
    this.dashboardService
      .getDashboards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
