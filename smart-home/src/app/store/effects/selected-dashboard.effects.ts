import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import * as A from '@/app/store/actions/dashboard.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTabs } from '@/app/store/selectors/selected-dashboard.selectors';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import { AppState } from '@/app/store/state/app.state';

@Injectable()
export class SelectedDashboardEffects {
  private readonly actions$ = inject<Actions>(Actions);
  private readonly api = inject(DashboardService);
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);

  readonly loadSelectedDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.selectDashboard),
      switchMap(({ dashboardId }) =>
        this.api.getDashboardById(dashboardId).pipe(
          map((data) => A.loadSelectedDashboardSuccess({ data })),
          catchError((error: unknown) =>
            of(
              A.loadSelectedDashboardFailure({ error: this.toMessage(error) }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly ensureValidTab$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(A.loadSelectedDashboardSuccess),
        withLatestFrom(this.store.select(selectTabs)),
        tap(([, tabs]) => {
          if (tabs.length === 0) return;
          const currentRouteTab = this.routeIds.tabIdRouteSignal();
          const validTab = this.routeIds.getValidTabId(tabs, currentRouteTab);

          if (validTab && validTab === currentRouteTab) return;

          if (validTab) {
            this.routeIds.selectTab(validTab);
          }
        }),
      ),
    { dispatch: false },
  );

  private toMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }
}
