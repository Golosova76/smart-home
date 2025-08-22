import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import {Observable, tap} from 'rxjs';
import { BASE_API_URL } from '@/app/shared/constants';
import { DataModel, Tab } from '@/app/shared/models/data.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${BASE_API_URL}dashboards`);
  }

  getDashboardById(id: string): Observable<DataModel> {
    return this.http.get<DataModel>(`${BASE_API_URL}dashboards/${id}`);
  }

  createDashboard(payload: Dashboard): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${BASE_API_URL}dashboards`, payload);
  }

  deleteDashboard(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_API_URL}dashboards/${id}`);
  }
}
