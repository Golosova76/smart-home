import { inject, Injectable, signal } from '@angular/core';
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { DataModel, Tab } from '@/app/shared/models/data.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { DashboardService } from '@/app/shared/services/dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardHandlerService {
  private readonly api = inject(DashboardService);

  readonly dashboardsSignal = signal<Dashboard[]>([]);
  readonly dashboardByIdSignal = signal<DataModel | null>(null);
  readonly tabsSignal = signal<Tab[]>([]);
  readonly lastLoadedDashboardIdSignal = signal<string | null>(null);

  loadDashboards(): Observable<Dashboard[]> {
    return this.api.getDashboards().pipe(
      tap((list) => this.dashboardsSignal.set(list)),
      catchError((error: unknown) => throwError(() => error)),
    );
  }

  loadDashboardById(dashboardId: string) {
    if (!dashboardId) {
      this.dashboardByIdSignal.set(null);
      this.tabsSignal.set([]);
      return throwError(() => new Error('dashboardId is empty'));
    }

    return this.api.getDashboardById(dashboardId).pipe(
      tap((DataModel) => {
        this.lastLoadedDashboardIdSignal.set(dashboardId);
        this.dashboardByIdSignal.set(DataModel);
        this.tabsSignal.set(DataModel.tabs ?? []);
      }),
    );
  }

  addDashboard(payload: Dashboard) {
    return this.api.createDashboard(payload).pipe(
      tap((created) => {
        if (created) {
          this.dashboardsSignal.update((list) => [...list, created]);
        }
      }),
      catchError((error: unknown) => throwError(() => error)),
    );
  }

  removeDashboard(dashboardId: string) {
    if (!dashboardId) {
      return throwError(() => new Error('dashboardId is empty'));
    }

    return this.api.deleteDashboard(dashboardId).pipe(
      tap(() => {
        this.dashboardsSignal.update((list) =>
          list.filter((dashboard) => dashboard.id !== dashboardId),
        );

        if (this.lastLoadedDashboardIdSignal() === dashboardId) {
          this.dashboardByIdSignal.set(null);
          this.tabsSignal.set([]);
          this.lastLoadedDashboardIdSignal.set(null);
        }
      }),
      map(() => this.dashboardsSignal()[0].id ?? null),
      catchError((error: unknown) => throwError(() => error)),
    );
  }
}
