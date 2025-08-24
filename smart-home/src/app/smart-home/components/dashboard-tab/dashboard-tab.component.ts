import { Component, computed, inject } from '@angular/core';
import { CardListComponent } from '@/app/smart-home/components/card-list/card-list.component';
import { ActivatedRoute } from '@angular/router';
import { DashboardHandlerService } from '@/app/shared/services/dashboard-handler.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-tab',
  imports: [CardListComponent],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss',
})
export class DashboardTabComponent {
  private route = inject(ActivatedRoute);
  handlerService = inject(DashboardHandlerService);

  readonly dashboardByIdSignal = this.handlerService.dashboardByIdSignal;
  readonly tabsSignal = this.handlerService.tabsSignal;

  readonly paramMap = toSignal(this.route.paramMap);
  readonly tabIdRoute = computed(() => this.paramMap()?.get('tabId') ?? null);

  readonly cards = computed(() => {
    const dataModel = this.dashboardByIdSignal();
    const tabIdRoute = this.tabIdRoute();
    if (!dataModel || !tabIdRoute) return [];
    return this.tabsSignal().find((tab) => tab.id === tabIdRoute)?.cards ?? [];
  });
}
