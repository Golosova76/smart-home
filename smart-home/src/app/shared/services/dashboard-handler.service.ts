import {inject, Injectable, signal} from '@angular/core';
import {Dashboard} from '@/app/shared/models/dashboard.model';
import {DataModel, Tab} from '@/app/shared/models/data.model';
import {Observable, tap} from 'rxjs';
import {DashboardService} from '@/app/shared/services/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardHandlerService {
  dashboardService = inject(DashboardService);

  readonly dashboardsSignal = signal<Dashboard[]>([]);
  readonly dashboardByIdSignal = signal<DataModel | null>(null);
  readonly tabsSignal = signal<Tab[]>([]);

  loadDashboards(): Observable<Dashboard[]> {
    return this.dashboardService.getDashboards().pipe(
      tap(list => this.dashboardsSignal.set(list))
    );
  }

}
