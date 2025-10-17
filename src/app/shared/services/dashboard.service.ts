import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import type { Observable } from "rxjs";
import { BASE_API_URL } from "@/app/shared/utils/constants";
import type {
  DataModel,
  DeviceState,
  Item,
} from "@/app/shared/models/data.model";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly http: HttpClient = inject(HttpClient);

  public getDashboards(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(`${BASE_API_URL}dashboards`);
  }

  public getDashboardById(id: string): Observable<DataModel> {
    return this.http.get<DataModel>(`${BASE_API_URL}dashboards/${id}`);
  }

  public createDashboard(payload: Dashboard): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${BASE_API_URL}dashboards`, payload);
  }

  public deleteDashboard(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_API_URL}dashboards/${id}`);
  }

  public saveDashboardById(
    id: string,
    payload: DataModel,
  ): Observable<DataModel> {
    return this.http.put<DataModel>(`${BASE_API_URL}dashboards/${id}`, payload);
  }

  public getDevices(): Observable<Item[]> {
    return this.http.get<Item[]>(`${BASE_API_URL}devices`);
  }

  public toggleDeviceState(
    deviceId: string,
    newState: boolean,
  ): Observable<DeviceState> {
    return this.http.patch<DeviceState>(`${BASE_API_URL}devices/${deviceId}`, {
      state: newState,
    });
  }
}
