import {Component, computed, inject} from '@angular/core';

import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';
import {DashboardService} from '@/app/shared/services/dashboard.service';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';


@Component({
  imports: [TabSwitcherComponent, RouterOutlet],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dashboardService = inject(DashboardService);

  //получение параметров URL - сигналы
  readonly paramMap = toSignal(this.route.paramMap);
  readonly dashboardIdRoute = computed(
    () => this.paramMap()?.get('dashboardId') ?? null,
  );
  readonly tabIdRoute = computed(() => this.paramMap()?.get('tabId') ?? null);

  //Получение IDashboard и IDataModel - сигналы
  readonly dashboards = this.dashboardService.dashboards;
  readonly dashboardById = this.dashboardService.dashboardById;
  readonly tabs = this.dashboardService.tabs;

  // получаем TabId кот соот роуту
  readonly selectedTabId = computed(() => {
    const tabs = this.tabs();
    return tabs.find((tab) => tab.id === this.tabIdRoute())?.id ?? null;
  });

  onTabSelected(tabId: string) {
    this.router.navigate(['/dashboard', this.dashboardIdRoute(), tabId]).catch(() => {});
  }


}
