import { Component, computed, inject } from '@angular/core';
import { CardListComponent } from '@/app/smart-home/components/card-list/card-list.component';
import * as SD from '@/app/store/selectors/selected-dashboard.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store/state/app.state';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';

@Component({
  selector: 'app-dashboard-tab',
  imports: [CardListComponent],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss',
})
export class DashboardTabComponent {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);

  readonly tabsSignal = this.store.selectSignal(SD.selectTabs);
  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly cards = computed(() => {
    const tabId = this.selectedTabId();
    if (!tabId) return [];
    return this.tabsSignal().find((t) => t.id === tabId)?.cards ?? [];
  });
}
