import {Component, computed, inject} from '@angular/core';
import {CardListComponent} from '@/app/smart-home/components/card-list/card-list.component';
import {DashboardService} from '@/app/shared/services/dashboard.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard-tab',
  imports: [CardListComponent],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss',
})
export class DashboardTabComponent {
  dashboardService = inject(DashboardService);
  private route = inject(ActivatedRoute);

  readonly dashboardById = this.dashboardService.dashboardById;
  readonly tabs = this.dashboardService.tabs;


  readonly paramMap = toSignal(this.route.paramMap);
  readonly tabIdRoute = computed(() => this.paramMap()?.get('tabId') ?? null);

  readonly cards = computed(() => {
    const dataModel = this.dashboardById();
    const tabIdRoute = this.tabIdRoute();
    if(!dataModel || !tabIdRoute) return [];
    return this.tabs().find(tab => tab.id === tabIdRoute)?.cards ?? [];
  })

}
