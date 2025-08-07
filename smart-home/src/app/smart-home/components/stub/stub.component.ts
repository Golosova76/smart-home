import { Component, inject } from '@angular/core';
import { DashboardService } from '@/app/shared/services/dashboard.service';

@Component({
  selector: 'app-stub',
  imports: [],
  templateUrl: './stub.component.html',
  styleUrl: './stub.component.scss',
})
export class StubComponent {
  dashboardService = inject(DashboardService);

  readonly dashboardsSignal = this.dashboardService.dashboardsSignal;
}
