import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import * as A from '@/app/store/actions/dashboard.actions';
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectDashboardId,
  selectTabs,
  selectWorkingCopy,
} from '@/app/store/selectors/selected-dashboard.selectors';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import { AppState } from '@/app/store/state/app.state';
import { AvailableItemsActions } from '@/app/store/actions/devices.actions';
import { availableItemsFeature } from '@/app/store/reducers/devices.reducer';

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

  readonly saveSelectedDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.saveDashboard),
      withLatestFrom(
        this.store.select(selectDashboardId),
        this.store.select(selectWorkingCopy),
      ),
      switchMap(([, dashboardId, data]) => {
        if (!dashboardId || !data)
          return of(
            A.saveSelectedDashboardFailure({ error: 'Nothing to save' }),
          );

        return this.api.saveDashboardById(dashboardId, data).pipe(
          map((data) => A.saveSelectedDashboardSuccess({ data })),
          catchError((error: unknown) =>
            of(
              A.saveSelectedDashboardFailure({ error: this.toMessage(error) }),
            ),
          ),
        );
      }),
    ),
  );

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AvailableItemsActions.load),
      withLatestFrom(this.store.select(availableItemsFeature.selectLoaded)),
      filter(([, loaded]) => !loaded),
      switchMap(() =>
        this.api.getDevices().pipe(
          map((result) => AvailableItemsActions.loadSuccess({ devices: result })),
          catchError((error: unknown) =>
            of(AvailableItemsActions.loadFailure({ error: this.toMessage(error) })),
          ),
        ),
      ),
    ),
  );

  private toMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }
}
