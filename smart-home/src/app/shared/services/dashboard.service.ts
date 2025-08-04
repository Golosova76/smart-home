import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { Observable, tap } from 'rxjs';
import { BASE_API_URL } from '@/app/shared/constants';
import { DataModel, Tab } from '@/app/shared/models/data.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  readonly dashboardsSignal = signal<Dashboard[]>([]);
  readonly dashboardByIdSignal = signal<DataModel | null>(null);
  readonly tabsSignal = signal<Tab[]>([]);

  getDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${BASE_API_URL}dashboards`).pipe(
      tap((dashboard: Dashboard[]) => {
        this.dashboardsSignal.set(dashboard);
      }),
    );
  }

  getDashboardById(id: string): Observable<DataModel> {
    return this.http.get<DataModel>(`${BASE_API_URL}dashboards/${id}`).pipe(
      tap((dataModel: DataModel) => {
        this.dashboardByIdSignal.set(dataModel);
        this.tabsSignal.set(dataModel.tabs);
      }),
    );
  }
}
