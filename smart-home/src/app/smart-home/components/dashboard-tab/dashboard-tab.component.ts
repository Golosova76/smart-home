import { Component, computed, inject } from '@angular/core';
import { CardListComponent } from '@/app/smart-home/components/card-list/card-list.component';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-tab',
  imports: [CardListComponent],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss',
})
export class DashboardTabComponent {
  dashboardService = inject(DashboardService);
  private route = inject(ActivatedRoute);

  readonly dashboardByIdSignal = this.dashboardService.dashboardByIdSignal;
  readonly tabsSignal = this.dashboardService.tabsSignal;

  readonly paramMap = toSignal(this.route.paramMap);
  readonly tabIdRoute = computed(() => this.paramMap()?.get('tabId') ?? null);

  readonly cards = computed(() => {
    const dataModel = this.dashboardByIdSignal();
    const tabIdRoute = this.tabIdRoute();
    if (!dataModel || !tabIdRoute) return [];
    return this.tabsSignal().find((tab) => tab.id === tabIdRoute)?.cards ?? [];
  });
}
