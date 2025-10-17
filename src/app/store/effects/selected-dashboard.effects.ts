import { concatLatestFrom } from "@ngrx/operators";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DashboardService } from "@/app/shared/services/dashboard.service";
import * as A from "@/app/store/actions/dashboard.actions";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from "rxjs";
import { Store } from "@ngrx/store";
import {
  selectDashboardId,
  selectTabs,
  selectWorkingCopy,
} from "@/app/store/selectors/selected-dashboard.selectors";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import type { AppState } from "@/app/store/state/app.state";
import { AvailableItemsActions } from "@/app/store/actions/devices.actions";
import { availableItemsFeature } from "@/app/store/reducers/devices.reducer";
import { DevicesActions } from "@/app/store/actions/dashboard.actions";

@Injectable()
export class SelectedDashboardEffects {
  private readonly actions$ = inject<Actions>(Actions);
  private readonly api: DashboardService = inject(DashboardService);
  private store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);

  private loadSelectedDashboard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.selectDashboard),
      distinctUntilChanged(
        (previous, current) => previous.dashboardId === current.dashboardId,
      ),
      switchMap(({ dashboardId }) =>
        this.api.getDashboardById(dashboardId).pipe(
          map((data) => A.loadSelectedDashboardSuccess({ data })),
          catchError((error: unknown) => {
            console.error('[dbg] loadSelectedDashboardFailure:', error); // 👈 лог ошибки
            return of(
              A.loadSelectedDashboardFailure({
                error: this.toMessage(error),
              }),
            );
          }),
        ),
      ),
    );
  });

  private ensureValidTab$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(A.loadSelectedDashboardSuccess),
        concatLatestFrom(() => this.store.select(selectTabs)),
        tap(([, tabs]) => {
          if (tabs.length === 0) return;
          const currentRouteTab = this.routeIds.tabIdRouteSignal();
          const validTab = this.routeIds.getValidTabId(tabs, currentRouteTab);

          const hasValid = typeof validTab === "string" && validTab.length > 0;
          const hasCurrent =
            typeof currentRouteTab === "string" && currentRouteTab.length > 0;

          if (hasValid && hasCurrent && validTab === currentRouteTab) return;

          if (hasValid) {
            this.routeIds.selectTab(validTab);
          }
        }),
      );
    },
    { dispatch: false },
  );

  private saveSelectedDashboard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(A.saveDashboard),
      concatLatestFrom(() => [
        this.store.select(selectDashboardId),
        this.store.select(selectWorkingCopy),
      ]),
      switchMap(([, dashboardId, data]) => {
        // явные проверки для strict-boolean-expressions
        const hasId = typeof dashboardId === "string" && dashboardId.length > 0;
        const hasData = data != null;

        if (!hasId || !hasData) {
          return of(
            A.saveSelectedDashboardFailure({ error: "Nothing to save" }),
          );
        }

        return this.api.saveDashboardById(dashboardId, data).pipe(
          map((data) => A.saveSelectedDashboardSuccess({ data })),
          catchError((error: unknown) =>
            of(
              A.saveSelectedDashboardFailure({ error: this.toMessage(error) }),
            ),
          ),
        );
      }),
    );
  });

  private loadDevices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AvailableItemsActions.load),
      concatLatestFrom(() =>
        this.store.select(availableItemsFeature.selectLoaded),
      ),
      filter(([, loaded]) => !loaded),
      switchMap(() =>
        this.api.getDevices().pipe(
          map((result) =>
            AvailableItemsActions.loadSuccess({ devices: result }),
          ),
          catchError((error: unknown) =>
            of(
              AvailableItemsActions.loadFailure({
                error: this.toMessage(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  private toggleDevice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DevicesActions.toggleDeviceState),
      mergeMap((action: { deviceId: string; newState: boolean }) => {
        const { deviceId, newState } = action;
        return this.api.toggleDeviceState(deviceId, newState).pipe(
          map((resp: { id?: string; state: boolean }) =>
            DevicesActions.toggleDeviceStateSuccess({
              deviceId: resp.id ?? deviceId,
              state: resp.state,
            }),
          ),
          catchError((error: unknown) =>
            of(
              DevicesActions.toggleDeviceStateFailure({
                deviceId,
                error,
              }),
            ),
          ),
        );
      }),
    );
  });

  private toMessage(error: unknown): string {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "Unknown error";
  }
}
