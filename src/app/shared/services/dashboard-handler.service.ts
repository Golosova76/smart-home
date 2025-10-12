import type { WritableSignal } from "@angular/core";
import { inject, Injectable, signal } from "@angular/core";
import type { Dashboard } from "@/app/shared/models/dashboard.model";
import type { DataModel, Tab } from "@/app/shared/models/data.model";
import type { Observable } from "rxjs";
import { catchError, map, tap, throwError } from "rxjs";
import { DashboardService } from "@/app/shared/services/dashboard.service";
import { isNonNull } from "@/app/shared/utils/is-null-or-empty";

@Injectable({
  providedIn: "root",
})
export class DashboardHandlerService {
  private readonly api: DashboardService = inject(DashboardService);

  public readonly dashboardsSignal: WritableSignal<Dashboard[]> = signal<
    Dashboard[]
  >([]);
  public readonly dashboardByIdSignal: WritableSignal<DataModel | null> =
    signal<DataModel | null>(null);
  public readonly tabsSignal: WritableSignal<Tab[]> = signal<Tab[]>([]);
  public readonly lastLoadedDashboardIdSignal: WritableSignal<string | null> =
    signal<string | null>(null);

  public loadDashboards(): Observable<Dashboard[]> {
    return this.api.getDashboards().pipe(
      tap((list: Dashboard[]): void => this.dashboardsSignal.set(list)),
      catchError(
        (error: unknown): Observable<never> => throwError((): unknown => error),
      ),
    );
  }

  public loadDashboardById(dashboardId: string): Observable<DataModel> {
    if (!dashboardId) {
      this.dashboardByIdSignal.set(null);
      this.tabsSignal.set([]);
      return throwError((): Error => new Error("dashboardId is empty"));
    }

    return this.api.getDashboardById(dashboardId).pipe(
      tap((DataModel: DataModel): void => {
        this.lastLoadedDashboardIdSignal.set(dashboardId);
        this.dashboardByIdSignal.set(DataModel);
        this.tabsSignal.set(DataModel.tabs ?? []);
      }),
    );
  }

  public addDashboard(payload: Dashboard): Observable<Dashboard> {
    return this.api.createDashboard(payload).pipe(
      tap((created: Dashboard): void => {
        if (isNonNull(created)) {
          this.dashboardsSignal.update((list: Dashboard[]): Dashboard[] => [
            ...list,
            created,
          ]);
        }
      }),
      catchError((error: unknown) => throwError(() => error)),
    );
  }

  public removeDashboard(dashboardId: string): Observable<string> {
    if (!dashboardId) {
      return throwError((): Error => new Error("dashboardId is empty"));
    }

    return this.api.deleteDashboard(dashboardId).pipe(
      tap((): void => {
        this.dashboardsSignal.update((list: Dashboard[]): Dashboard[] =>
          list.filter(
            (dashboard: Dashboard): boolean => dashboard.id !== dashboardId,
          ),
        );

        if (this.lastLoadedDashboardIdSignal() === dashboardId) {
          this.dashboardByIdSignal.set(null);
          this.tabsSignal.set([]);
          this.lastLoadedDashboardIdSignal.set(null);
        }
      }),
      map((): string => this.dashboardsSignal()[0].id ?? null),
      catchError(
        (error: unknown): Observable<never> => throwError((): unknown => error),
      ),
    );
  }
}
